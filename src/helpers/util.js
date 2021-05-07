import * as R from 'ramda';

// objPropsCnt: returns the count of property keys in an object
// object -> integer
export const objPropsCnt = R.pipe(R.keys, R.length);