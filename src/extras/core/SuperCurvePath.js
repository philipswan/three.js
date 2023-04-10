import { SuperCurve } from './SuperCurve.js';
import * as SuperCurves from '../curves/SuperCurves.js';

/**************************************************************
 *	SuperCurved Path - a SuperCurve path is simply a array of connected
 *  SuperCurves, but retains the api of a SuperCurve
 **************************************************************/

class SuperCurvePath extends SuperCurve {

	constructor() {

		super();

		this.type = 'SuperCurvePath';

		this.superCurves = [];
		this.autoClose = false; // Automatically closes the path

	}

	add( superCurve ) {

		this.superCurves.push( superCurve );

	}

	closePath() {

		// Add a line superCurve if start and end of lines are not connected
		const startPoint = this.superCurves[ 0 ].getPoint( 0 );
		const endPoint = this.superCurves[ this.superCurves.length - 1 ].getPoint( 1 );

		if ( ! startPoint.equals( endPoint ) ) {

			this.superCurves.push( new SuperCurves[ 'LineSuperCurve3' ]( endPoint, startPoint ) );

		}

	}

	// To get accurate point with reference to
	// entire path distance at time t,
	// following has to be done:

	// 1. Length of each sub path have to be known
	// 2. Locate and identify type of superCurve
	// 3. Get t for the superCurve
	// 4. Return superCurve.getPointAt(t')

	getPoint( t, optionalTarget ) {

		const d = t * this.getLength();
		const curveLengths = this.getSuperCurveLengths();
		let i = 0;

		// To think about boundaries points.

		while ( i < curveLengths.length ) {

			if ( curveLengths[ i ] >= d ) {

				const diff = curveLengths[ i ] - d;
				const superCurve = this.superCurves[ i ];

				const segmentLength = superCurve.getLength();
				const u = segmentLength === 0 ? 0 : 1 - diff / segmentLength;

				return superCurve.getPointAt( u, optionalTarget );

			}

			i ++;

		}

		return null;

		// loop where sum != 0, sum > d , sum+1 <d

	}

	// We cannot use the default THREE.SuperCurve getPoint() with getLength() because in
	// THREE.SuperCurve, getLength() depends on getPoint() but in THREE.SuperCurvePath
	// getPoint() depends on getLength

	getLength() {

		const lens = this.getSuperCurveLengths();
		return lens[ lens.length - 1 ];

	}

	// cacheLengths must be recalculated.
	updateArcLengths() {

		this.needsUpdate = true;
		this.cacheLengths = null;
		this.getCurveLengths();

	}

	// Compute lengths and cache them
	// We cannot overwrite getLengths() because UtoT mapping uses it.

	getCurveLengths() {

		// We use cache values if superCurves and cache array are same length

		if ( this.cacheLengths && this.cacheLengths.length === this.superCurves.length ) {

			return this.cacheLengths;

		}

		// Get length of sub-superCurve
		// Push sums into cached array

		const lengths = [];
		let sums = 0;

		for ( let i = 0, l = this.superCurves.length; i < l; i ++ ) {

			sums += this.superCurves[ i ].getLength();
			lengths.push( sums );

		}

		this.cacheLengths = lengths;

		return lengths;

	}

	getSpacedPoints( divisions = 40 ) {

		const points = [];

		for ( let i = 0; i <= divisions; i ++ ) {

			points.push( this.getPoint( i / divisions ) );

		}

		if ( this.autoClose ) {

			points.push( points[ 0 ] );

		}

		return points;

	}

	getPoints( divisions = 12 ) {

		const points = [];
		let last;

		for ( let i = 0, superCurves = this.superCurves; i < superCurves.length; i ++ ) {

			const superCurve = superCurves[ i ];
			const resolution = superCurve.isEllipseSuperCurve ? divisions * 2
				: ( superCurve.isLineCurve || superCurve.isLineSuperCurve3 ) ? 1
					: superCurve.isSplineSuperCurve ? divisions * superCurve.points.length
						: divisions;

			const pts = superCurve.getPoints( resolution );

			for ( let j = 0; j < pts.length; j ++ ) {

				const point = pts[ j ];

				if ( last && last.equals( point ) ) continue; // ensures no consecutive points are duplicates

				points.push( point );
				last = point;

			}

		}

		if ( this.autoClose && points.length > 1 && ! points[ points.length - 1 ].equals( points[ 0 ] ) ) {

			points.push( points[ 0 ] );

		}

		return points;

	}

	copy( source ) {

		super.copy( source );

		this.superCurves = [];

		for ( let i = 0, l = source.superCurves.length; i < l; i ++ ) {

			const superCurve = source.superCurves[ i ];

			this.superCurves.push( superCurve.clone() );

		}

		this.autoClose = source.autoClose;

		return this;

	}

	toJSON() {

		const data = super.toJSON();

		data.autoClose = this.autoClose;
		data.superCurves = [];

		for ( let i = 0, l = this.superCurves.length; i < l; i ++ ) {

			const superCurve = this.superCurves[ i ];
			data.superCurves.push( superCurve.toJSON() );

		}

		return data;

	}

	fromJSON( json ) {

		super.fromJSON( json );

		this.autoClose = json.autoClose;
		this.superCurves = [];

		for ( let i = 0, l = json.superCurves.length; i < l; i ++ ) {

			const superCurve = json.superCurves[ i ];
			this.superCurves.push( new SuperCurves[ superCurve.type ]().fromJSON( superCurve ) );

		}

		return this;

	}

}


export { SuperCurvePath };
