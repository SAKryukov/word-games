/*
  Read-only namespaces
  Copyright (c) 2025 by Sergey A Kryukov
  http://www.SAKryukov.org
  https://github.com/SAKryukov/word-games
*/

"use strict";

const namespaces = (() => {

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

	const extend = (namespace, propertySource, readonly = true) => {
		const newProperties = {};
		for (let index in propertySource) {
			const property = propertySource[index];
			if (readonly)
				deepFreeze(property);
			newProperties[index] = {};
			newProperties[index].get = () => property;
			newProperties[index].enumerable = true;
		} //loop
		Object.defineProperties(namespace, newProperties);
		return namespace;
	}; //extend

	const create = (propertySource, readonly = true) => {
		const namespace = {};
		extend (namespace, propertySource, readonly);
		return namespace;
	}; //create

	const namespacesNamespace = { create: create, extend: extend };
	Object.freeze(namespacesNamespace);
	return namespacesNamespace;

})();
