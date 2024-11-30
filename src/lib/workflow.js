export const cleanWorkflow = (workflow) => {
  console.log('cleanWorkflow', workflow);

  const clean = JSON.parse(JSON.stringify(workflow));
  clean.options = clean.options || {};

  const cleanSteps = [];
  for (const step of clean.steps) {
    if (step.name == 'limit') {
      clean.options.limit = step.args.limit;
      continue;
    }

    if (step.args.limit) {
      clean.options.limit = step.args.limit;
      delete step.args.limit;
    }

    cleanSteps.push(step);
  }

  clean.steps = cleanSteps;

  return clean;
};
