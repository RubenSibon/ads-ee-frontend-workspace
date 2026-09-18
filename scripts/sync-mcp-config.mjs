#!/usr/bin/env node

import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

const rootDir = process.cwd()
const sourcePath = path.join(rootDir, '.mcp.json')
const targetPath = path.join(rootDir, '.vscode', 'mcp.json')
const isCheckMode = process.argv.includes('--check')

function sortKeysDeep(value) {
  if (Array.isArray(value)) {
    return value.map(sortKeysDeep)
  }

  if (value && typeof value === 'object') {
    return Object.keys(value)
      .sort()
      .reduce((acc, key) => {
        acc[key] = sortKeysDeep(value[key])
        return acc
      }, {})
  }

  return value
}

function toNormalizedJson(value) {
  return `${JSON.stringify(sortKeysDeep(value), null, 2)}\n`
}

async function readJson(filePath) {
  const content = await readFile(filePath, 'utf8')
  return JSON.parse(content)
}

async function main() {
  let sourceJson

  try {
    sourceJson = await readJson(sourcePath)
  } catch (error) {
    console.error(`Cannot read ${sourcePath}: ${error.message}`)
    process.exit(1)
  }

  const sourceNormalized = toNormalizedJson(sourceJson)

  if (isCheckMode) {
    let targetJson

    try {
      targetJson = await readJson(targetPath)
    } catch (error) {
      console.error(`Cannot read ${targetPath}: ${error.message}`)
      process.exit(1)
    }

    const targetNormalized = toNormalizedJson(targetJson)

    if (sourceNormalized !== targetNormalized) {
      console.error('MCP config is out of sync: .mcp.json and .vscode/mcp.json differ.')
      console.error('Run: node scripts/sync-mcp-config.mjs')
      process.exit(1)
    }

    console.log('MCP config is in sync.')
    return
  }

  await mkdir(path.dirname(targetPath), { recursive: true })
  await writeFile(targetPath, sourceNormalized, 'utf8')
  console.log('Synced .vscode/mcp.json from .mcp.json')
}

main().catch(error => {
  console.error(error)
  process.exit(1)
})
