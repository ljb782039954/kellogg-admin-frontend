import { describe, it, expect } from 'vitest';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const SRC = join(process.cwd(), 'src');

function files(dir: string): string[] {
  const out: string[] = [];
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) out.push(...files(full));
    else if (/\.tsx?$/.test(name) && !/\.test\.tsx?$/.test(name)) out.push(full);
  }
  return out;
}

describe('Phase 2b: UI 基础层已迁入 package/ui', () => {
  it('真身落在 package/ui 下', () => {
    expect(existsSync(join(SRC, 'package/ui/primitives/button.tsx'))).toBe(true);
    expect(existsSync(join(SRC, 'package/ui/forms/BilingualInput.tsx'))).toBe(true);
    expect(existsSync(join(SRC, 'package/ui/forms/LinkSelector.tsx'))).toBe(true);
    expect(existsSync(join(SRC, 'package/ui/media/AdminImage.tsx'))).toBe(true);
  });

  it('旧 src/ui/{primitives,forms,media,navigation} 仅含 re-export 垫片', () => {
    const reExportOnly = /^(\s*(\/\/.*|export \* from '[^']+';|export (type )?\{[^}]*\} from '[^']+';))+\s*$/;
    for (const dir of ['ui/primitives', 'ui/forms', 'ui/media', 'ui/navigation']) {
      for (const f of files(join(SRC, dir))) {
        const body = readFileSync(f, 'utf8').trim();
        expect(reExportOnly.test(body), `${f} 应只含 re-export`).toBe(true);
      }
    }
  });
});
