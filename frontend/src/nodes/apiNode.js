// apiNode.js - NEW NODE

import { BaseNode } from './BaseNode';
import { apiNodeConfig } from './nodeConfigs';

export const ApiNode = ({ id, data }) => {
  return <BaseNode id={id} data={data} config={apiNodeConfig} />;
};
