import React, { useState, useMemo } from 'react';
import { ChevronDown, ChevronRight, Users } from 'lucide-react';
import { buildTreeFromFlat, TreeNode, getTreeDepth, countNodes } from '../utils/treeTransform';

interface UserNode {
  id: string;
  name: string;
  role: string;
  managerId: string | null;
}

interface NodeProps {
  node: TreeNode;
  level: number;
}

// Color scheme for different hierarchy levels (cycles)
const LEVEL_COLORS = [
  { bg: 'bg-blue-50', border: 'border-blue-300', accent: 'text-blue-700' },
  { bg: 'bg-amber-50', border: 'border-amber-300', accent: 'text-amber-700' },
  { bg: 'bg-emerald-50', border: 'border-emerald-300', accent: 'text-emerald-700' },
  { bg: 'bg-purple-50', border: 'border-purple-300', accent: 'text-purple-700' },
  { bg: 'bg-pink-50', border: 'border-pink-300', accent: 'text-pink-700' },
  { bg: 'bg-indigo-50', border: 'border-indigo-300', accent: 'text-indigo-700' },
];

/**
 * Recursive Tree Node Component
 * Supports infinite nesting with collapse/expand, visual hierarchy, and interactive features
 */
const TreeNodeComponent: React.FC<NodeProps> = ({ node, level }) => {
  const [isExpanded, setIsExpanded] = useState(level < 2); // Auto-expand first 2 levels
  const hasChildren = node.subordinates.length > 0;
  const colors = LEVEL_COLORS[level % LEVEL_COLORS.length];

  return (
    <div className="mb-0.5">
      <div className="flex items-stretch gap-0">
        {/* Connecting line and toggle */}
        <div
          className="flex min-w-fit flex-col items-center px-2"
          style={{ marginLeft: `${level * 1.5}rem` }}
        >
          {hasChildren && (
            <button
              className={`flex h-6 w-6 items-center justify-center rounded-full transition-colors hover:bg-slate-200`}
              onClick={() => setIsExpanded(!isExpanded)}
              title={isExpanded ? 'Collapse branch' : 'Expand branch'}
            >
              {isExpanded ? (
                <ChevronDown size={16} className="text-slate-600" />
              ) : (
                <ChevronRight size={16} className="text-slate-600" />
              )}
            </button>
          )}
          {!hasChildren && (
            <div className="h-6 w-6 flex items-center justify-center">
              <div className="h-1.5 w-1.5 rounded-full bg-slate-300" />
            </div>
          )}
        </div>

        {/* Node card */}
        <div className="flex-1">
          <div
            className={`flex items-center gap-3 rounded-lg border-2 ${colors.bg} ${colors.border} px-3 py-2 transition-all hover:shadow-md`}
          >
            {/* Role badge */}
            <div
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${colors.accent}`}
            >
              <span
                className={`h-2 w-2 rounded-full`}
                style={{ backgroundColor: colors.accent.split('-')[1] }}
              />
              {node.role}
            </div>

            {/* Name and subordinate count */}
            <div className="flex-1">
              <div className="font-semibold text-slate-900">{node.name}</div>
              {hasChildren && (
                <div className="text-xs text-slate-500">
                  {node.subordinates.length} direct report{node.subordinates.length !== 1 ? 's' : ''}
                </div>
              )}
            </div>

            {/* Total subordinates (if expanded and has children) */}
            {isExpanded && hasChildren && (
              <div className="flex items-center gap-1 rounded-full bg-white/60 px-2 py-0.5 text-xs font-medium text-slate-600">
                <Users size={12} />
                <span>{node.subordinates.length}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Subordinates subtree (with connecting lines) */}
      {isExpanded && hasChildren && (
        <div className="relative">
          {/* Vertical connector line */}
          <div
            className="absolute left-0 top-0 w-0.5 bg-gradient-to-b from-slate-300 to-slate-200"
            style={{
              left: `${level * 1.5 + 1.5}rem`,
              marginTop: '1.75rem',
              marginBottom: '0.5rem',
              height: `${node.subordinates.length * 2.75 + 0.5}rem`,
            }}
          />
          {node.subordinates.map((subordinate) => (
            <div key={subordinate.id} className="relative">
              {/* Horizontal connector line */}
              <div
                className="absolute h-0.5 bg-slate-300"
                style={{
                  left: `${level * 1.5 + 1.5}rem`,
                  top: '1.75rem',
                  width: '1rem',
                }}
              />
              <TreeNodeComponent node={subordinate} level={level + 1} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

interface Props {
  tree: UserNode[];
}

/**
 * User Management Tree Component
 * Renders an organizational hierarchy with infinite nesting support
 * Features: collapse/expand, visual hierarchy, tree statistics, scrollable container
 */
const UserTree: React.FC<Props> = ({ tree }) => {
  // Transform flat user array into nested tree structure
  const nestedTree = useMemo(() => buildTreeFromFlat(tree), [tree]);

  // Calculate tree statistics
  const treeStats = useMemo(() => {
    if (nestedTree.length === 0) return null;
    const depths = nestedTree.map(getTreeDepth);
    const maxDepth = Math.max(...depths);
    const totalNodes = countNodes(nestedTree);
    return { maxDepth, totalNodes, rootCount: nestedTree.length };
  }, [nestedTree]);

  // Empty state
  if (!tree || tree.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-panel">
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <Users size={32} className="mx-auto mb-2 text-slate-300" />
            <p className="text-sm text-slate-500">No user hierarchy available</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-panel">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Organizational Hierarchy</h2>
          <p className="mt-1 text-xs text-slate-500">
            Click arrows to expand/collapse branches
          </p>
        </div>
        {treeStats && (
          <div className="flex gap-4 text-xs font-medium text-slate-600">
            <div className="rounded-lg bg-blue-50 px-3 py-1">
              <span className="text-blue-700">{treeStats.totalNodes}</span> users
            </div>
            <div className="rounded-lg bg-amber-50 px-3 py-1">
              <span className="text-amber-700">{treeStats.maxDepth}</span> levels
            </div>
          </div>
        )}
      </div>

      {/* Tree container with scrolling support */}
      <div className="space-y-1 overflow-x-auto overflow-y-auto rounded-lg border border-slate-100 bg-gradient-to-br from-slate-50 to-white p-4" style={{ maxHeight: '600px' }}>
        {nestedTree.map((root) => (
          <TreeNodeComponent key={root.id} node={root} level={0} />
        ))}
      </div>

      {/* Footer info */}
      <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
        <span>Showing {treeStats?.rootCount} root manager{treeStats?.rootCount !== 1 ? 's' : ''}</span>
        <span>Total {treeStats?.totalNodes} employee{treeStats?.totalNodes !== 1 ? 's' : ''}</span>
      </div>
    </div>
  );
};

export default UserTree;
