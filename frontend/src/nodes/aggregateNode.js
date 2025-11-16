// aggregateNode.js - NEW NODE

import { BaseNode } from './BaseNode';
import { aggregateNodeConfig } from './nodeConfigs';

export const AggregateNode = ({ id, data }) => {
  return <BaseNode id={id} data={data} config={aggregateNodeConfig} />;
};
