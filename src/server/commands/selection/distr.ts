import { assertClipboard, assertSelection } from "@modules/assert.js";
import { Jobs } from "@modules/jobs.js";
import { RawText } from "@notbeer-api";
import { BlockPermutation } from "@minecraft/server";
import { registerCommand } from "../register_commands.js";

const registerInformation = {
  name: "distr",
  description: "commands.wedit:distr.description",
  permission: "worldedit.analysis.distr",
  usage: [
    {
      flag: "c"
    },
    {
      flag: "d"
    }
  ]
};

registerCommand(registerInformation, function* (session, builder, args) {
  let total: number;
  const counts: Map<string, number> = new Map();
  const getStates = args.has("d");
  let job: number;

  try {
    let i = 0;
    const processBlock = (block: BlockPermutation) => {
      let id = block.type.id;
      if (getStates) {
        for (const val of Object.values(block.getAllProperties())) {
          id += `|${val}`;
        }
      }
      counts.set(id, (counts.get(id) ?? 0) + 1);
      Jobs.setProgress(job, ++i/total);
    };

    if (args.has("c")) {
      assertClipboard(session);
      total = session.clipboard.getBlockCount();
      const clipboard = session.clipboard;

      job = (yield Jobs.startJob(session, 1, null)) as number;
      Jobs.nextStep(job, "Analysing blocks...");

      for (const block of clipboard.getBlocks()) {
        processBlock(Array.isArray(block) ? block[1] : block);
        yield;
      }
    } else {
      assertSelection(session);
      total = session.selection.getBlockCount();
      const dimension = builder.dimension;

      job = (yield Jobs.startJob(session, 1, session.selection.getRange())) as number;
      Jobs.nextStep(job, "Analysing blocks...");

      for (const loc of session.selection.getBlocks()) {
        processBlock(dimension.getBlock(loc).permutation);
        yield;
      }
    }
  } finally {
    Jobs.finishJob(job);
  }

  const entries = Array.from(counts.entries()).sort((a, b) => b[1] - a[1]);
  const result = RawText.text("__________\n");
  // eslint-disable-next-line prefer-const
  for (let [block, count] of entries) {
    if (getStates) {
      let i = 1;
      const blockData = block.split("|");
      const states: Map<string, string> = new Map();
      const blockDefault = BlockPermutation.resolve(blockData[0]);
      for (const [state, val] of Object.entries(blockDefault.getAllProperties())) {
        if (blockData[i] && `${val}` != blockData[i]) {
          states.set(state, blockData[i]);
        }
        i++;
      }

      block = blockData[0];
      if (states.size) {
        block += "[";
        for (const [state, val] of states.entries()) {
          block += `${state}=${val},`;
        }
        block = block.slice(0, -1) + "]";
      }
    }

    const percent = (count / total * 100).toFixed(3);
    if (block.startsWith("minecraft:")) {
      block = block.slice("minecraft:".length);
    }
    result.append("text", `\n${count}${" ".repeat(8 - count.toString().length * 1.5)} (%${percent}) ${block}`);
  }
  return result;
});
