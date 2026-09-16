import path from 'node:path'
import { pathToFileURL } from 'node:url'

export async function resolve(specifier, context, nextResolve) {
  if (specifier === 'playwright') {
    return {
      url: pathToFileURL(path.join(process.cwd(), 'node_modules', 'playwright', 'index.mjs')).href,
      shortCircuit: true,
    }
  }
  return nextResolve(specifier, context)
}
