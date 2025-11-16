from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any

app = FastAPI()

# CORS configuration to allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request model
class PipelineData(BaseModel):
    nodes: List[Dict[str, Any]]
    edges: List[Dict[str, Any]]

@app.get('/')
def read_root():
    return {'Ping': 'Pong'}

@app.post('/pipelines/parse')
def parse_pipeline(pipeline: PipelineData):
    """
    Parse pipeline and validate if it forms a DAG.
    Returns: {num_nodes: int, num_edges: int, is_dag: bool}
    """
    nodes = pipeline.nodes
    edges = pipeline.edges

    num_nodes = len(nodes)
    num_edges = len(edges)

    # Check if the graph is a DAG (Directed Acyclic Graph)
    is_dag = is_directed_acyclic_graph(nodes, edges)

    return {
        'num_nodes': num_nodes,
        'num_edges': num_edges,
        'is_dag': is_dag
    }

def is_directed_acyclic_graph(nodes: List[Dict], edges: List[Dict]) -> bool:
    """
    Check if the graph formed by nodes and edges is a DAG.
    Uses DFS with recursion stack to detect cycles.
    """
    # Build adjacency list
    graph = {node['id']: [] for node in nodes}

    for edge in edges:
        source = edge.get('source')
        target = edge.get('target')
        if source in graph and target in graph:
            graph[source].append(target)

    # Track visited nodes and nodes in current recursion stack
    visited = set()
    rec_stack = set()

    def has_cycle(node_id: str) -> bool:
        """DFS to detect cycle"""
        visited.add(node_id)
        rec_stack.add(node_id)

        # Check all neighbors
        for neighbor in graph.get(node_id, []):
            # If neighbor not visited, recurse
            if neighbor not in visited:
                if has_cycle(neighbor):
                    return True
            # If neighbor is in recursion stack, we found a cycle
            elif neighbor in rec_stack:
                return True

        # Remove from recursion stack before returning
        rec_stack.remove(node_id)
        return False

    # Check for cycles starting from each unvisited node
    for node in nodes:
        node_id = node['id']
        if node_id not in visited:
            if has_cycle(node_id):
                return False  # Found a cycle, not a DAG

    return True  # No cycles found, it's a DAG
