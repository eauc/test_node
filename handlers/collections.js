import R from 'ramda';
import collectionModel from '../models/collection';
import entryModel from '../models/entry';


module.exports = ({
  middlewares: { effects: { effects } },
  services: { state: { registerInit, registerHandler } },
}) => {
  registerHandler('state-initCollection', [effects], stateInitCollectionHandler);
  registerInit('state-initCollection');

  registerHandler('route-collectionList', [effects], routeCollectionListHandler);
  registerHandler('route-collectionCreate', [effects], routeCollectionCreateHandler);
  registerHandler('route-collectionFind', [effects], routeCollectionFindHandler);
  registerHandler('route-collectionUpdate', [effects], routeCollectionUpdateHandler);
  registerHandler('route-collectionRemove', [effects], routeCollectionRemoveHandler);
};

function stateInitCollectionHandler(_event_, { state }) {
  return {
    state: R.assoc('collection', [], state),
  };
}

function routeCollectionListHandler(_event_, { state }) {
  const data = {
    link: '/collection',
    collection: R.propOr([], 'collection', state),
  };
  return {
    httpResponse: {
      data,
    },
  };
}

function routeCollectionCreateHandler(_event_, { request, state }) {
  const entry = entryModel.create(request.body);
  const data = {
    link: `/collection/${entry.id}`,
    entry,
  };
  return {
    httpResponse: { status: 201, data },
    state: R.over(
      R.lensProp('collection'),
      (collection) => collectionModel.create({ entry }, collection),
      state
    ),
  };
}

function routeCollectionFindHandler(_event_, { request, state }) {
  const { params: { id } } = request;
  const entry = collectionModel.find(
    { id },
    R.propOr([], 'collection', state)
  );
  const status = R.isNil(entry) ? 404 : 200;
  const data = {
    link: `/collection/${id}`,
    entry,
  };
  return {
    httpResponse: { status, data },
  };
}

function routeCollectionUpdateHandler(_event_, { request, state }) {
  const { params: { id } } = request;
  let entry = collectionModel.find(
    { id },
    R.propOr([], 'collection', state)
  );
  if (R.isNil(entry)) {
    const data = {
      link: `/collection/${id}`,
    };
    return {
      httpResponse: { status: 404, data },
    };
  }

  entry = entryModel.update({ data: request.body }, entry);
  const data = {
    link: `/collection/${id}`,
    entry,
  };
  return {
    httpResponse: { data },
    state: R.over(
      R.lensProp('collection'),
      (collection) => collectionModel.update({ entry }, collection),
      state
    ),
  };
}

function routeCollectionRemoveHandler(_event_, { request, state }) {
  const { params: { id } } = request;
  return {
    httpResponse: { status: 204, data: 'done' },
    state: R.over(
      R.lensProp('collection'),
      (collection) => collectionModel.remove({ id }, collection),
      state
    ),
  };
}
