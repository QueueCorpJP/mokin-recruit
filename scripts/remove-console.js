/**
 * jscodeshift transform: Remove all console.* calls in client components (files with 'use client').
 * - Removes standalone console calls (as statements)
 * - Replaces inline console calls used as expressions with `void 0`
 * - Replaces inline console calls inside JSX with `null`
 */

module.exports = function transformer(fileInfo, api) {
  const j = api.jscodeshift;
  const source = fileInfo.source;

  const root = j(source);

  // Detect 'use client' via AST to allow leading comments
  const program = root.find(j.Program).paths()[0];
  const hasUseClientDirective =
    program && program.node && Array.isArray(program.node.directives)
      ? program.node.directives.some(
          d => d.value && d.value.value === 'use client'
        )
      : false;

  if (!hasUseClientDirective) {
    return source;
  }

  const isConsoleCallee = callee => {
    if (!callee) return false;
    // MemberExpression or OptionalMemberExpression
    const isMember =
      callee.type === 'MemberExpression' ||
      callee.type === 'OptionalMemberExpression';
    if (!isMember) return false;
    const obj = callee.object;
    return obj && obj.type === 'Identifier' && obj.name === 'console';
  };

  const isInsideJSX = path => {
    let p = path.parentPath;
    while (p) {
      const t = p.node && p.node.type;
      if (t === 'JSXExpressionContainer') return true;
      p = p.parentPath;
    }
    return false;
  };

  root
    .find(j.CallExpression)
    .filter(path => isConsoleCallee(path.node.callee))
    .forEach(path => {
      const parent = path.parentPath;
      if (parent && parent.node && parent.node.type === 'ExpressionStatement') {
        // Standalone statement: remove the entire statement
        j(parent).remove();
        return;
      }

      // Inline usage: keep expression shape
      if (isInsideJSX(path)) {
        j(path).replaceWith(() => j.literal(null));
      } else {
        j(path).replaceWith(() => j.unaryExpression('void', j.literal(0)));
      }
    });

  return root.toSource({ quote: 'single' });
};
