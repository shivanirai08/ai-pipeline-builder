// conditionNode.js - NEW NODE

import { BaseNode } from './BaseNode';
import { conditionNodeConfig } from './nodeConfigs';

export const ConditionNode = ({ id, data }) => {
  return <BaseNode id={id} data={data} config={conditionNodeConfig} />;
};
