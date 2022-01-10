/**
 * EIF400 -- Paradigmas de Programacion
 * @since II Term - 2021
 * @authors Team 01-10am
 *  - Andres Alvarez Duran 117520958 
 *  - Joaquin Barrientos Monge 117440348
 *  - Oscar Ortiz Chavarria 208260347
 *  - David Zarate Marin 116770797
 * 
 * This is an adaptation of 
 * jsBezier made for educational purposes
 * exclusively for the development of PAREDIFA
 * 
 * Source: https://github.com/vgarciasc/dfa-draw/blob/master/js/jsbezier.js
 */

/** 
 *
 * Copyright (c) 2010 - 2017 jsPlumb (hello@jsplumbtoolkit.com)
 *
 * licensed under the MIT license.
 *
 * a set of Bezier curve functions that deal with Beziers, used by jsPlumb, and perhaps useful for other people.  These functions work with Bezier
 * curves of arbitrary degree.
 *
 * - functions are all in the 'jsBezier' namespace.
 *
 * - all input points should be in the format {x:.., y:..}. all output points are in this format too.
 *
 * - all input curves should be in the format [ {x:.., y:..}, {x:.., y:..}, {x:.., y:..}, {x:.., y:..} ]
 *
 * - 'location' as used as an input here refers to a decimal in the range 0-1 inclusive, which indicates a point some proportion along the length
 * of the curve.  location as output has the same format and meaning.
 *
 *
 * Function List:
 * --------------
 *
 * distanceFromCurve(point, curve)
 *
 * 	Calculates the distance that the given point lies from the given Bezier.  Note that it is computed relative to the center of the Bezier,
 * so if you have stroked the curve with a wide pen you may wish to take that into account!  The distance returned is relative to the values
 * of the curve and the point - it will most likely be pixels.
 *
 * gradientAtPoint(curve, location)
 *
 * 	Calculates the gradient to the curve at the given location, as a decimal between 0 and 1 inclusive.
 *
 * gradientAtPointAlongCurveFrom (curve, location)
 *
 *	Calculates the gradient at the point on the given curve that is 'distance' units from location.
 *
 * nearestPointOnCurve(point, curve)
 *
 *	Calculates the nearest point to the given point on the given curve.  The return value of this is a JS object literal, containing both the
 *point's coordinates and also the 'location' of the point (see above), for example:  { point:{x:551,y:150}, location:0.263365 }.
 *
 * pointOnCurve(curve, location)
 *
 * 	Calculates the coordinates of the point on the given Bezier curve at the given location.
 *
 * pointAlongCurveFrom(curve, location, distance)
 *
 * 	Calculates the coordinates of the point on the given curve that is 'distance' units from location.  'distance' should be in the same coordinate
 * space as that used to construct the Bezier curve.  For an HTML Canvas usage, for example, distance would be a measure of pixels.
 *
 * locationAlongCurveFrom(curve, location, distance)
 *
 * 	Calculates the location on the given curve that is 'distance' units from location.  'distance' should be in the same coordinate
 * space as that used to construct the Bezier curve.  For an HTML Canvas usage, for example, distance would be a measure of pixels.
 *
 * perpendicularToCurveAt(curve, location, length, distance)
 *
 * 	Calculates the perpendicular to the given curve at the given location.  length is the length of the line you wish for (it will be centered
 * on the point at 'location'). distance is optional, and allows you to specify a point along the path from the given location as the center of
 * the perpendicular returned.  The return value of this is an array of two points: [ {x:...,y:...}, {x:...,y:...} ].
 *
 *
 */



if(typeof Math.sgn == "undefined") {
    Math.sgn = function(x) { return x == 0 ? 0 : x > 0 ? 1 :-1; };
}
    
const intStream = (start = 0, end , inclusive = 0) => 
{       
        const n = end - start;
        return Array.from(new Array(  n + inclusive  ), (_, i) =>  start + i ) ;
    
};
    

const Vectors = {
        subtract 	: 	function(v1, v2) { return {x:v1.x - v2.x, y:v1.y - v2.y }; },
        dotProduct	: 	function(v1, v2) { return (v1.x * v2.x)  + (v1.y * v2.y); },
        square		:	function(v) { return Math.sqrt((v.x * v.x) + (v.y * v.y)); },
        scale		:	function(v, s) { return {x:v.x * s, y:v.y * s }; }
    },

maxRecursion = 64,
flatnessTolerance = Math.pow(2.0,-maxRecursion-1);

/**
 * Calculates the distance that the point lies from the curve.
 *
 * @param point a point in the form {x:567, y:3342}
 * @param curve a Bezier curve in the form [{x:..., y:...}, {x:..., y:...}, {x:..., y:...}, {x:..., y:...}].  note that this is currently
 * hardcoded to assume cubiz beziers, but would be better off supporting any degree.
 * @return a JS object literal containing location and distance, for example: {location:0.35, distance:10}.  Location is analogous to the location
 * argument you pass to the pointOnPath function: it is a ratio of distance travelled along the curve.  Distance is the distance in pixels from
 * the point to the curve.
 */
export  const _distanceFromCurve = (point, curve) => {
    let candidates = [],
    w = _convertToBezier(point, curve),
    degree = curve.length - 1, higherDegree = (2 * degree) - 1,
    numSolutions = _findRoots(w, higherDegree, candidates, 0),
    v = Vectors.subtract(point, curve[0]), dist = Vectors.square(v), t = 0.0;
        
    let newDist;
    intStream(0 , numSolutions).forEach( (_, i) => {
        v = Vectors.subtract(point, _bezier(curve, degree, candidates[i], null, null));
        newDist = Vectors.square(v);
        if (newDist < dist) {
            dist = newDist;
            t = candidates[i];
        }
    });

    v = Vectors.subtract(point, curve[degree]);
    newDist = Vectors.square(v);
    if (newDist < dist) {
        dist = newDist;
        t = 1.0;
    }
    return {location:t, distance:dist};
};

const _convertToBezier = (point, curve) => { 
    let degree = curve.length - 1, 
    higherDegree = (2 * degree) - 1,
    cdTable = [], 
    z = [ [1.0, 0.6, 0.3, 0.1], [0.4, 0.6, 0.6, 0.4], [0.1, 0.3, 0.6, 1.0] ];
    const c =  intStream(0, degree ,  1).map( (_, i) => Vectors.subtract(curve[i], point));
    const d =  intStream(0, degree).map( (_, i) => Vectors.scale(Vectors.subtract(curve[i+1], curve[i]), 3.0) );

    for (let row = 0; row <= degree - 1; row++) {
        for (let column = 0; column <= degree; column++) {
            if (!cdTable[row]) cdTable[row] = [];
            cdTable[row][column] = Vectors.dotProduct(d[row], c[column]);
        }
    }

    const w =  intStream(0, higherDegree , 1).reduce((stored, current, i)=>{
        if(!stored[i]) stored[i]=[]
        stored[i].y=0.0;
        stored[i].x= parseFloat(i) / higherDegree;
        return stored;
    }, []);

    const n = degree, m = degree-1;
    for (let k = 0; k <= n + m; k++) {
        let lb = Math.max(0, k - m),
            ub = Math.min(k, n);
        for (let i = lb; i <= ub; i++) {
            let j = k - i;
            w[i+j].y += cdTable[j][i] * z[j][i];
        }
    }
    return w;
};

const _findRoots = (w, degree, t, depth) => { 
    let left = [], right = [],
        left_count, right_count,
        left_t = [], right_t = [];

    switch (_getCrossingCount(w, degree)) {
        case 0 : {
            return 0;
        }
        case 1 : {
            if (depth >= maxRecursion) {
                t[0] = (w[0].x + w[degree].x) / 2.0;
                return 1;
            }
            if (_isFlatEnough(w, degree)) {
                t[0] = _computeXIntercept(w, degree);
                return 1;
            }
            break;
        }
    }
    _bezier(w, degree, 0.5, left, right);
    left_count  = _findRoots(left,  degree, left_t, depth+1);
    right_count = _findRoots(right, degree, right_t, depth+1);

    intStream(0, left_count ).forEach( (_, i) => t[i] = left_t[i]);
    intStream(0, right_count ).forEach( (_, i)=>  t[i+left_count] = right_t[i]);
    return (left_count + right_count);
};


const _getCrossingCount = (curve, degree) => { 
    let n_crossings = 0, sign, old_sign;
    sign = old_sign = Math.sgn(curve[0].y);


    for (let i = 1; i <= degree; i++) {
        sign = Math.sgn(curve[i].y);
        if (sign != old_sign) n_crossings++;
        old_sign = sign;
    }
    return n_crossings;
};


const _isFlatEnough = (curve, degree) => { 
    let  error,
        intercept_1, intercept_2, left_intercept, right_intercept,
        a, b, c, det, dInv, a1, b1, c1, a2, b2, c2;
    a = curve[0].y - curve[degree].y;
    b = curve[degree].x - curve[0].x;
    c = curve[0].x * curve[degree].y - curve[degree].x * curve[0].y;

    let max_distance_above = 0.0;
    let max_distance_below = 0.0;

    intStream(1, degree).forEach( (_, i) => {
        const value = a * curve[i].x + b * curve[i].y + c;
        if (value > max_distance_above)
            max_distance_above = value;
        else if (value < max_distance_below)
            max_distance_below = value;
    })

    a1 = 0.0; b1 = 1.0; c1 = 0.0; a2 = a; b2 = b;
    c2 = c - max_distance_above;
    det = a1 * b2 - a2 * b1;
    dInv = 1.0/det;
    intercept_1 = (b1 * c2 - b2 * c1) * dInv;
    a2 = a; b2 = b; c2 = c - max_distance_below;
    det = a1 * b2 - a2 * b1;
    dInv = 1.0/det;
    intercept_2 = (b1 * c2 - b2 * c1) * dInv;
    left_intercept = Math.min(intercept_1, intercept_2);
    right_intercept = Math.max(intercept_1, intercept_2);
    error = right_intercept - left_intercept;
    return (error < flatnessTolerance)? 1 : 0;
};

const _computeXIntercept = (curve, degree) => { 
    const XLK = 1.0, YLK = 0.0,
        XNM = curve[degree].x - curve[0].x, YNM = curve[degree].y - curve[0].y,
        XMK = curve[0].x - 0.0, YMK = curve[0].y - 0.0,
        det = XNM*YLK - YNM*XLK, detInv = 1.0/det,
        S = (XNM*YMK - YNM*XMK) * detInv;
    return 0.0 + XLK * S;
};

const _bezier = function(curve, degree, t, left, right) { 
    const temp = [[]];
    intStream(0, degree ,  1 ).forEach((_, i) => temp[0][i] = curve[i])

    for (let i = 1; i <= degree; i++) {
        for (let j =0 ; j <= degree - i; j++) {
            if (!temp[i]) temp[i] = [];
            if (!temp[i][j]) temp[i][j] = {};
            temp[i][j].x = (1.0 - t) * temp[i-1][j].x + t * temp[i-1][j+1].x;
            temp[i][j].y = (1.0 - t) * temp[i-1][j].y + t * temp[i-1][j+1].y;
        }
    }
    if (left != null)
        intStream(0, degree, 1).forEach((_, i ) => left[i]  = temp[i][0])
          
    if (right != null)
        intStream(0, degree, 1).forEach((_, i ) => right[i] = temp[degree-i][i])

    return (temp[degree][0]);
};




