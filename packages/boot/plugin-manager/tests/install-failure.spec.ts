/** Filesystem refusals retain actionable classification even in a shortened pnpm log. */
import { describe, expect, it } from 'vitest'
import { classifyInstallFailure } from '../src/install-failure.ts'

describe('filesystem install failures', () => {
  it.each([
    '[ERR_PNPM_EPERM] [importPackage C:\\Users\\test\\.dsh\\profiles\\desktop\\node_modules\\dsh-boot-animation]\nEPERM: operation not permitted, rename dsh-boot-animation_tmp_41392_13 -> dsh-boot-animation',
    '[ERR_PNPM_EPERM] [importPackage dsh-boot-animation]',
    '[ERR_PNPM_EACCES] permission refused',
    '[ERR_PNPM_EBUSY] resource busy',
    'EBUSY: resource busy or locked, rename',
    'EACCES: permission denied, mkdir',
  ])('classifies filesystem access failure: %s', (log) => {
    expect(classifyInstallFailure({ log })).toBe('permission')
  })

  it('preserves timeout precedence and leaves unrelated codes unknown', () => {
    expect(classifyInstallFailure({ log: '[ERR_PNPM_EPERM]', timedOut: true })).toBe('timeout')
    expect(classifyInstallFailure({ log: '[ERR_PNPM_EPERM_OTHER]' })).toBe('unknown')
    expect(classifyInstallFailure({ log: '[ERR_PNPM_FETCH_502]' })).toBe('network')
  })
})
