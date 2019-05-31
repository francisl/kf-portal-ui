import { expect } from 'chai';
import { cloneDeep } from 'lodash';
import { cyan } from 'chalk';

import {
  setSqonValueAtIndex,
  MERGE_VALUES_STRATEGIES,
  MERGE_OPERATOR_STRATEGIES,
} from './sqonUtils';

const numberOfSqonsDidntChanged = (sourceSqons, sqonIndex, newSqons) => {
  expect(newSqons[sqonIndex].content.length).to.equal(sourceSqons[sqonIndex].content.length);
};

describe(cyan.bold('sqonUtils'), () => {
  describe('setSqonValueAtIndex', () => {
    describe('given an empty sqon in "targetSqons" at the given "targetIndex"', () => {
      const targetIndex = 0;
      let sourceSqons;

      beforeEach(() => {
        sourceSqons = [{ op: 'and', content: [] }];
      });

      it('adds the operation of the "newSqon" in the "targetSqons"', () => {
        const newSqon = {
          op: '<=',
          content: { field: 'fieldName', value: [123] },
        };

        const resultingSqons = setSqonValueAtIndex(sourceSqons, targetIndex, newSqon);

        const resultingSqon = resultingSqons[targetIndex];
        expect(resultingSqon.content.length).to.equal(1);

        const appendedOperation = resultingSqon.content[0];
        expect(appendedOperation.op).to.equal('<=');
        expect(appendedOperation.content.field).to.equal('fieldName');
        expect(appendedOperation.content.value).to.deep.equal([123]);
      });

      it('does not mutates the "targetSqons" parameter', () => {
        const sqonsClone = cloneDeep(sourceSqons);

        setSqonValueAtIndex(sourceSqons, targetIndex, {
          op: 'in',
          content: { field: 'meow', value: [1, 2, 3] },
        });

        expect(sqonsClone).be.deep.equal(sourceSqons);
      });

      it('throws if no operator is provided and the field is not found', () => {
        expect(() => {
          setSqonValueAtIndex(sourceSqons, targetIndex, {
            content: { field: 'friends', value: ['snap', 'crackle', 'pop'] },
          });
        }).to.throw(
          'Cannot add the field "friends" to the sqons: no operator provided and no matching field found in sqons',
        );
      });
    });

    describe('given that the "field" exists in "targetSqons" at the given "targetIndex"', () => {
      const sqonIndex = 0;
      let sourceSqons;

      beforeEach(() => {
        sourceSqons = [
          {
            op: 'and',
            content: [
              { op: 'in', content: { field: 'pets', value: ['cats', 'dogs'] } },
              { op: 'in', content: { field: 'names', value: ['Bob'] } },
              { op: '<=', content: { field: 'age', value: [5] } },
            ],
          },
        ];
      });

      it('replaces the value of the field', () => {
        const newSqon = {
          op: 'in',
          content: { field: 'names', value: ['Robert Paulson'] },
        };

        const sqons = setSqonValueAtIndex(sourceSqons, sqonIndex, newSqon);

        numberOfSqonsDidntChanged(sourceSqons, sqonIndex, sqons);
        expect(sqons[sqonIndex].content[1].content.value).to.be.deep.equal(['Robert Paulson']);
      });

      it('replaces the operator', () => {
        const newSqon = {
          op: '>',
          content: { field: 'age', value: [55] },
        };

        const sqons = setSqonValueAtIndex(sourceSqons, sqonIndex, newSqon);

        numberOfSqonsDidntChanged(sourceSqons, sqonIndex, sqons);
        expect(sqons[sqonIndex].content[2].op).to.be.deep.equal(newSqon.op);
      });

      it('does not set the operator if none is provided in newSqon', () => {
        const newSqon = {
          content: { field: 'age', value: [75] },
        };

        const sqons = setSqonValueAtIndex(sourceSqons, sqonIndex, newSqon);

        numberOfSqonsDidntChanged(sourceSqons, sqonIndex, sqons);
        expect(sqons[sqonIndex].content[2].op).to.be.deep.equal('<=');
      });

      describe('given that options are provided', () => {
        it('overrides the value if the "values" is not provided (default)', () => {
          const newSqon = {
            op: 'in',
            content: { field: 'pets', value: ['birds', 'cats'] },
          };

          const sqons = setSqonValueAtIndex(sourceSqons, sqonIndex, newSqon, {
            // `opts` provided, but not `values`
          });

          expect(sqons[sqonIndex].content[0]).to.be.deep.equal({
            op: 'in',
            content: {
              field: 'pets',
              value: ['birds', 'cats'],
            },
          });
        });

        it('overrides the value if the "values" is "OVERRIDE_VALUES"', () => {
          const newSqon = {
            op: 'in',
            content: { field: 'pets', value: ['birds', 'cats'] },
          };

          const sqons = setSqonValueAtIndex(sourceSqons, sqonIndex, newSqon, {
            values: MERGE_VALUES_STRATEGIES.OVERRIDE_VALUES,
          });

          expect(sqons[sqonIndex].content[0]).to.be.deep.equal({
            op: 'in',
            content: {
              field: 'pets',
              value: ['birds', 'cats'],
            },
          });
        });

        it('merge the value if the "values" is "APPEND_VALUES"', () => {
          const newSqon = {
            op: 'in',
            content: { field: 'pets', value: ['birds', 'cats'] },
          };

          const sqons = setSqonValueAtIndex(sourceSqons, sqonIndex, newSqon, {
            values: MERGE_VALUES_STRATEGIES.APPEND_VALUES,
          });

          expect(sqons[sqonIndex].content[0]).to.be.deep.equal({
            op: 'in',
            content: {
              field: 'pets',
              value: ['cats', 'dogs', 'birds'],
            },
          });
        });

        it('replaces the operator if the "operator" is not provided (default)', () => {
          const newSqon = {
            op: 'not',
            content: { field: 'pets', value: ['birds', 'cats'] },
          };

          const sqons = setSqonValueAtIndex(sourceSqons, sqonIndex, newSqon, {
            // `opts` provided, but not `operator`
          });

          expect(sqons[sqonIndex].content[0].op).to.be.deep.equal('not');
        });

        it('replaces the operator if the "operator" is "OVERRIDE_OPERATOR"', () => {
          const newSqon = {
            op: 'not',
            content: { field: 'pets', value: ['birds', 'cats'] },
          };

          const sqons = setSqonValueAtIndex(sourceSqons, sqonIndex, newSqon, {
            operator: MERGE_OPERATOR_STRATEGIES.OVERRIDE_OPERATOR,
          });

          expect(sqons[sqonIndex].content[0].op).to.be.deep.equal('not');
        });

        it('keep the operator in the if the "operator" is "KEEP_OPERATOR"', () => {
          const newSqon = {
            op: 'not',
            content: { field: 'pets', value: ['birds', 'cats'] },
          };

          const sqons = setSqonValueAtIndex(sourceSqons, sqonIndex, newSqon, {
            operator: MERGE_OPERATOR_STRATEGIES.KEEP_OPERATOR,
          });

          expect(sqons[sqonIndex].content[0]).to.be.deep.equal({
            op: 'in',
            content: {
              field: 'pets',
              value: ['birds', 'cats'],
            },
          });
        });
      });
    });

    describe('given that there is a reference in the sqons', () => {
      let sourceSqons;

      beforeEach(() => {
        sourceSqons = [
          {
            op: 'and',
            content: { op: 'in', content: { field: 'job', value: ['developer'] } },
          },
          {
            op: 'and',
            content: [
              0,
              {
                op: 'in',
                content: { field: 'names', value: ['Bob'] },
              },
            ],
          },
        ];
      });

      it('does not resolves references', () => {
        const newSqon = {
          op: 'in',
          content: { field: 'job', value: ['devop', 'firemen'] },
        };

        const sqons = setSqonValueAtIndex(sourceSqons, 1, newSqon);

        expect(sqons[1].content[2]).to.be.deep.equal(newSqon);
      });
    });

    describe('given a deeply nested sqon', () => {
      let sourceSqons;

      beforeEach(() => {
        sourceSqons = [
          {
            op: 'and',
            content: [
              {
                op: 'or',
                content: [
                  { op: 'in', content: { field: 'names', value: ['Bob'] } },
                  { op: '<', content: { field: 'age', value: [10] } },
                  { op: 'in', content: { field: 'pets', value: ['cat', 'lizard'] } },
                ],
              },
            ],
          },
        ];
      });

      it('still find and edits the field', () => {
        const newSqon = {
          op: '>',
          content: { field: 'age', value: [25] },
        };

        const sqons = setSqonValueAtIndex(sourceSqons, 0, newSqon);

        expect(sqons).to.deep.equal([
          {
            op: 'and',
            content: [
              {
                op: 'or',
                content: [
                  { op: 'in', content: { field: 'names', value: ['Bob'] } },
                  { op: '>', content: { field: 'age', value: [25] } },
                  { op: 'in', content: { field: 'pets', value: ['cat', 'lizard'] } },
                ],
              },
            ],
          },
        ]);
      });

      it('append the new sqon to the root level if not found', () => {
        const newSqon = {
          op: 'in',
          content: { field: 'lucky number', value: [713105] },
        };

        const sqons = setSqonValueAtIndex(sourceSqons, 0, newSqon);

        expect(sqons).to.deep.equal([
          {
            op: 'and',
            content: [
              {
                op: 'or',
                content: [
                  { op: 'in', content: { field: 'names', value: ['Bob'] } },
                  { op: '<', content: { field: 'age', value: [10] } },
                  { op: 'in', content: { field: 'pets', value: ['cat', 'lizard'] } },
                ],
              },
              {
                op: 'in',
                content: { field: 'lucky number', value: [713105] },
              },
            ],
          },
        ]);
      });
    });
  });
});

// what about newSqon containing multiple field/values?
// - i.e. root-level sqon `newSQON` is a boolean operator
