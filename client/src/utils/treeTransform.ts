// Utility for transforming flat user array into nested tree structure
// Supports infinite depth and efficiently builds hierarchies

export interface UserNode {
  id: string;
  name: string;
  role: string;
  managerId: string | null;
}

export interface TreeNode extends UserNode {
  subordinates: TreeNode[];
}

/**
 * Transform a flat array of users into a nested tree structure
 * @param users - Flat array of users with managerId relationships
 * @returns Array of root nodes with nested subordinates
 */
export const buildTreeFromFlat = (users: UserNode[]): TreeNode[] => {
  if (!users || users.length === 0) return [];

  // Create a map for O(1) lookup
  const userMap = new Map<string, TreeNode>();

  // Initialize all nodes as TreeNodes
  users.forEach(user => {
    userMap.set(user.id, {
      ...user,
      subordinates: []
    });
  });

  // Build parent-child relationships
  const roots: TreeNode[] = [];
  users.forEach(user => {
    const node = userMap.get(user.id)!;
    if (user.managerId) {
      const parent = userMap.get(user.managerId);
      if (parent) {
        // Add this node as a subordinate of its manager
        parent.subordinates.push(node);
      } else {
        // If manager not found, treat as root (orphaned node)
        roots.push(node);
      }
    } else {
      // No manager = root node
      roots.push(node);
    }
  });

  // Sort subordinates by name for consistent display
  const sortSubordinates = (nodes: TreeNode[]) => {
    nodes.forEach(node => {
      node.subordinates.sort((a, b) => a.name.localeCompare(b.name));
      if (node.subordinates.length > 0) {
        sortSubordinates(node.subordinates);
      }
    });
  };

  sortSubordinates(roots);
  return roots.sort((a, b) => a.name.localeCompare(b.name));
};

/**
 * Get all subordinates recursively (flat list)
 * Useful for searching, filtering, or bulk operations
 */
export const getAllSubordinates = (node: TreeNode): TreeNode[] => {
  const result: TreeNode[] = [];
  const traverse = (current: TreeNode) => {
    result.push(current);
    current.subordinates.forEach(traverse);
  };
  traverse(node);
  return result;
};

/**
 * Get tree depth
 */
export const getTreeDepth = (node: TreeNode): number => {
  if (node.subordinates.length === 0) return 1;
  return 1 + Math.max(...node.subordinates.map(getTreeDepth));
};

/**
 * Count total nodes in tree
 */
export const countNodes = (roots: TreeNode[]): number => {
  let count = 0;
  const traverse = (node: TreeNode) => {
    count++;
    node.subordinates.forEach(traverse);
  };
  roots.forEach(traverse);
  return count;
};
