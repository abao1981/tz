import { compose, is, both, prop } from "ramda";


export let isArray = is(Array); 
export let isArrayOfArray = both(isArray, compose(isArray, prop('0')));
