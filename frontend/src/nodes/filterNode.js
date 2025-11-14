// filterNode.js - NEW NODE

import { BaseNode } from './BaseNode';
import { filterNodeConfig } from './nodeConfigs';

export const FilterNode = ({ id, data }) => {
  return <BaseNode id={id} data={data} config={filterNodeConfig} />;
};
