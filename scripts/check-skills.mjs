#!/usr/bin/env node

import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'

const rootDir = process.cwd()

// Keys of the ADS-VERSION comment in a skill, mapped to their package in design-system
const adsPackagePaths = {
  assets: 'packages-proprietary/assets',
  css: 'packages/css',
  icons: 'packages-proprietary/react-icons',
  react: 'packages/react',
  tokens: 'packages-proprietary/tokens',
}

async function readText(filePath) {
  try {
    return await readFile(filePath, 'utf8')
  } catch {
    return undefined
  }
}

// Paths of all files below dir, relative to it, or undefined if dir does not exist
async function listFiles(dir) {
  try {
    const entries = await readdir(dir, { recursive: true, withFileTypes: true })
    return entries.filter(entry => entry.isFile()).map(entry => path.relative(dir, path.join(entry.parentPath, entry.name)))
  } catch {
    return undefined
  }
}

async function findSourceDrift(name, installedDir, sourceDir) {
  const sourceFiles = await listFiles(sourceDir)

  if (!sourceFiles) {
    return [`${name}: cannot compare, ${path.relative(rootDir, sourceDir)} does not exist`]
  }

  const problems = []

  for (const file of new Set([...((await listFiles(installedDir)) ?? []), ...sourceFiles])) {
    const [installed, source] = await Promise.all([
      readText(path.join(installedDir, file)),
      readText(path.join(sourceDir, file)),
    ])

    if (installed !== source) {
      problems.push(`${name}: ${file} differs from ${path.relative(rootDir, sourceDir)}`)
    }
  }

  return problems
}

async function findVersionDrift(name, installedDir) {
  const marker = (await readText(path.join(installedDir, 'SKILL.md')))?.match(/<!-- ADS-VERSION: (.+?) -->/)
  const problems = []

  for (const [key, version] of marker?.[1].split(' ').map(pair => pair.split('=')) ?? []) {
    const packagePath = adsPackagePaths[key]
    const packageJson = packagePath && (await readText(path.join(rootDir, 'design-system', packagePath, 'package.json')))

    if (!packageJson) {
      problems.push(`${name}: no design-system package found for ADS-VERSION key "${key}"`)
      continue
    }

    const { version: current } = JSON.parse(packageJson)

    if (version !== current) {
      problems.push(`${name}: written for ${key} ${version}, design-system has ${current}`)
    }
  }

  return problems
}

async function main() {
  const lock = JSON.parse(await readFile(path.join(rootDir, 'skills-lock.json'), 'utf8'))
  const problems = []

  for (const [name, { source, skillPath }] of Object.entries(lock.skills)) {
    const installedDir = path.join(rootDir, '.agents', 'skills', name)
    const sourceDir = path.join(rootDir, path.basename(source), path.dirname(skillPath))

    problems.push(...(await findSourceDrift(name, installedDir, sourceDir)))
    problems.push(...(await findVersionDrift(name, installedDir)))
  }

  if (problems.length > 0) {
    console.error(problems.join('\n'))
    process.exit(1)
  }

  console.log('Installed skills match their source and the design-system versions.')
}

main().catch(error => {
  console.error(error)
  process.exit(1)
})
