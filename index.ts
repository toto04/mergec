#!/usr/bin/env node

import path from "path"
import fs from "fs/promises"
import { program } from "commander"

program
    .name("mergec")
    .version("0.0.1")
    .description(
        "mergec is a tool for merging multiple C source files into one."
    )

program.argument("<sourcefile>", "The file to be processed")
program.argument("<outfile>", "Merged file path")
program.parse()

async function merge(filepath: string): Promise<string> {
    const file = await fs.readFile(filepath, "utf8")
    const lines = file.split("\n")

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i]
        if (line.startsWith('#include "')) {
            const include = line
                .split(" ")[1]
                .substring(1)
                .substring(0, line.length - 11)
            const includepath = path.join(path.dirname(filepath), include)
            lines[i] = await merge(includepath)
        }
    }
    return lines.join("\n")
}

const filepath = program.args[0]
const nf = await merge(filepath)
fs.writeFile(program.args[1], nf)
