// transformNode.js - NEW NODE

import { BaseNode } from './BaseNode';
import { transformNodeConfig } from './nodeConfigs';

export const TransformNode = ({ id, data }) => {
  return <BaseNode id={id} data={data} config={transformNodeConfig} />;
};
