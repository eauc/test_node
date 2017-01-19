import R from 'ramda';
import uuid from 'node-uuid';

module.exports = {
  create,
  update,
};

function create(baseData) {
  return R.assoc('id', uuid.v4(), baseData);
}

function update({ data }, entry) {
  const safeData = R.without(['id'], data);
  return R.merge(entry, safeData);
}
