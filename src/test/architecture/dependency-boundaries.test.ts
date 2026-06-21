import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const SRC = join(process.cwd(), 'src');

// 只扫描生产代码；测试文件可合法跨边界导入
function collectFiles(dir: string): string[] {
  const out: string[] = [];
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) out.push(...collectFiles(full));
    else if (/\.tsx?$/.test(name) && !/\.test\.tsx?$/.test(name)) out.push(full);
  }
  return out;
}

function importSpecifiers(file: string): string[] {
  const src = readFileSync(file, 'utf8');
  const specs: string[] = [];
  const re = /(?:import|export)[^'"]*?from\s*['"]([^'"]+)['"]/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(src))) specs.push(m[1]);
  return specs;
}

function offenders(dir: string, forbidden: RegExp): string[] {
  const found: string[] = [];
  for (const file of collectFiles(dir)) {
    for (const spec of importSpecifiers(file)) {
      if (forbidden.test(spec)) found.push(`${file} → ${spec}`);
    }
  }
  return found;
}

describe('依赖边界', () => {
  it('core 不导入 package/features/components/ui/app/context/types', () => {
    const forbidden = /^@\/(package|features|components|ui|app|context|types)(\/|$)/;
    expect(offenders(join(SRC, 'core'), forbidden)).toEqual([]);
  });

  it('shared/i18n 不导入任何 @/ 业务路径', () => {
    const forbidden = /^@\//;
    expect(offenders(join(SRC, 'shared', 'i18n'), forbidden)).toEqual([]);
  });
});
