/*
  Word games
  Copyright (c) 2025 by Sergey A Kryukov
  http://www.SAKryukov.org
  https://github.com/SAKryukov/word-games
*/

"use strict";

const makeNamespace = (namespace, readonly, properties) => {

	const deepFreeze = object => {
		Object.freeze(object);
		const propNames = Reflect.ownKeys(object);
		for (const name of propNames) {
			const value = object[name];
			Object.freeze(value);
			if ((value && value.constructor == Object) || value instanceof Function)
				deepFreeze(value);
		} //loop
	}; //deepFreeze

	const newProperties = {};

	for (let index in properties) {
		const property = properties[index];
		if (readonly)
			deepFreeze(property);
		newProperties[index] = {};
		newProperties[index].get = () => property;
		newProperties[index].enumerable = true;
	} //loop
	Object.defineProperties(namespace, newProperties);

}; //makeNamespace

/* Usage:

const myNamespace = {};
makeNamespace(myNamespace, true, {
	definitionSet: {
		a: 13,
		b: "some content",
		c: 21.31,
		d: {
			e: [1, 2, 3],
			f: 2,
		},
	}, //definitionSet
});

*/
