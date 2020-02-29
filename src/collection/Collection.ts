import { shallow } from 'merge-strategies';
import { PureCollection } from './PureCollection';
import { CollectionDefine } from './types';
import { EmptyType } from '../types';

const internal = Symbol('Collection');

export class Collection<
  T extends Record<string, any> = Record<string, any>,
  V extends Record<string, any> = Record<string, any>
> extends PureCollection<T> {
  private [internal]: { variables: V; define: CollectionDefine<T, V> };
  public constructor(variables: V, define: CollectionDefine<T, V>) {
    super(() => define(new PureCollection(() => this[internal].variables)));
    this[internal] = { variables, define };
  }
  public create(variables?: Partial<V> | EmptyType): Collection<T, V> {
    const instance = new Collection(
      this[internal].variables,
      this[internal].define
    );
    return variables ? instance.use(variables) : instance;
  }
  public use(variables: Partial<V>): this {
    if (variables) {
      this[internal].variables = shallow(
        this[internal].variables,
        variables
      ) as V;
    }

    return this.clear();
  }
}
