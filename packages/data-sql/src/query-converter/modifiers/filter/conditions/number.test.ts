import type { ConditionNumberNode } from '@directus/data';
import { randomIdentifier, randomInteger } from '@directus/random';
import { beforeEach, expect, test } from 'vitest';
import type { AbstractSqlQueryConditionNode } from '../../../../index.js';
import { createIndexGenerators, type IndexGenerators } from '../../../../utils/create-index-generators.js';
import type { FilterResult } from '../utils.js';
import { convertNumberNode } from './number.js';

let indexGen: IndexGenerators;
let randomCollection: string;
let randomField: string;
let randomValue: number;

beforeEach(() => {
	indexGen = createIndexGenerators();
	randomCollection = randomIdentifier();
	randomField = randomIdentifier();
	randomValue = randomInteger(1, 100);
});

test('convert number condition', () => {
	const con: ConditionNumberNode = {
		type: 'condition-number',
		target: {
			type: 'primitive',
			field: randomField,
		},
		operation: 'gt',
		compareTo: randomValue,
	};

	const expectedWhere: AbstractSqlQueryConditionNode = {
		type: 'condition',
		negate: false,
		condition: {
			type: 'condition-number',
			target: {
				type: 'primitive',
				table: randomCollection,
				column: randomField,
			},
			operation: 'gt',
			compareTo: {
				type: 'value',
				parameterIndex: 0,
			},
		},
	};

	const expectedResult: FilterResult = {
		clauses: {
			where: expectedWhere,
			joins: [],
		},
		parameters: [randomValue],
	};

	expect(convertNumberNode(con, randomCollection, indexGen, false)).toStrictEqual(expectedResult);
});

test('convert number condition with function', () => {
	const con: ConditionNumberNode = {
		type: 'condition-number',
		target: {
			type: 'fn',
			field: randomField,
			fn: {
				type: 'extractFn',
				fn: 'month',
			},
		},
		operation: 'gt',
		compareTo: randomValue,
	};

	const expectedWhere: AbstractSqlQueryConditionNode = {
		type: 'condition',
		condition: {
			type: 'condition-number',
			target: {
				type: 'fn',
				table: randomCollection,
				column: randomField,
				fn: {
					type: 'extractFn',
					fn: 'month',
				},
			},
			operation: 'gt',
			compareTo: {
				type: 'value',
				parameterIndex: 0,
			},
		},
		negate: false,
	};

	const expectedResult: FilterResult = {
		clauses: {
			where: expectedWhere,
			joins: [],
		},
		parameters: [randomValue],
	};

	expect(convertNumberNode(con, randomCollection, indexGen, false)).toStrictEqual(expectedResult);
});
