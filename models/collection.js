import R from 'ramda';

module.exports = {
  create,
  find,
  update,
  remove,
};

function create({ entry }, collection) {
  return R.append(entry, collection);
}

function find({ id }, collection) {
  return R.find(R.propEq('id', id), collection);
}

function update({ entry }, collection) {
  const { id } = entry;
  return R.pipe(
    R.findIndex(R.propEq('id', id)),
    R.ifElse(
      R.lte(0),
      R.update(R.__, entry, collection),
      () => collection
    )
  )(collection);
}

function remove({ id }, collection) {
  return R.reject(R.propEq('id', id), collection);
}
