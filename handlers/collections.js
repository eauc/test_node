import R from 'ramda';
import collectionModel from '../models/collection';
import entryModel from '../models/entry';


module.exports = ({
  middlewares: { logger: { logger }, effects: { effects } },
  services: { state: { registerInit, registerHandler } },
}) => {
  const middlewares = [
    logger('collection'),
    effects,
  ];
  registerHandler('state-initCollection', middlewares, stateInitCollectionHandler);
  registerInit('state-initCollection');

  registerHandler('route-collectionList', middlewares, routeCollectionListHandler);
  registerHandler('route-collectionListCombined', middlewares, routeCollectionListCombinedHandler);
  registerHandler('route-collectionListCombinedResponse', middlewares, routeCollectionListCombinedResponseHandler);
  registerHandler('route-collectionCreate', middlewares, routeCollectionCreateHandler);
  registerHandler('route-collectionFind', middlewares, routeCollectionFindHandler);
  registerHandler('route-collectionFindCombined', middlewares, routeCollectionFindCombinedHandler);
  registerHandler('route-collectionFindCombinedResponse', middlewares, routeCollectionCombinedResponseHandler);
  registerHandler('route-collectionUpdate', middlewares, routeCollectionUpdateHandler);
  registerHandler('route-collectionUpdateCombined', middlewares, routeCollectionUpdateCombinedHandler);
  registerHandler('route-collectionUpdateCombinedResponse', middlewares, routeCollectionCombinedResponseHandler);
  registerHandler('route-collectionRemove', middlewares, routeCollectionRemoveHandler);
  registerHandler('route-collectionRemoveCombined', middlewares, routeCollectionRemoveCombinedHandler);
  registerHandler('route-collectionRemoveCombinedResponse', middlewares, routeCollectionRemoveCombinedResponseHandler);
};

function stateInitCollectionHandler(_event_, { state, logger }) {
  logger('info', 'stateInitCollectionHandler');
  return {
    state: R.assoc('collection', [], state),
  };
}

function routeCollectionListHandler(_event_, { state, logger }) {
  logger('info', 'routeCollectionListHandler');
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

function routeCollectionListCombinedHandler({ server }, { logger }) {
  logger('info', 'routeCollectionListCombinedHandler');
  return {
    httpRequest: {
      method: 'GET',
      url: otherServerCollectionUrl(server),
      onSuccess: { eventName: 'route-collectionListCombinedResponse' },
    },
  };
}

function routeCollectionListCombinedResponseHandler(
  { httpData },
  { state, logger }
) {
  logger('info', 'routeCollectionListCombinedResponseHandler');
  const data = {
    link: '/collection/combined',
    collection: R.concat(
      R.propOr([], 'collection', state),
      R.propOr([], 'collection', httpData)
    ),
  };
  return {
    httpResponse: {
      data,
    },
  };
}

function routeCollectionCreateHandler(_event_, { request, state, logger }) {
  logger('info', 'routeCollectionCreateHandler');
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

function routeCollectionFindHandler(_event_, { request, state, logger }) {
  logger('info', 'routeCollectionFindHandler');
  const { params: { id } } = request;
  return collectionFindInState({ id }, state) || {
    httpResponse: { status: 404, data: { link: `/collection/${id}` } },
  };
}

function routeCollectionFindCombinedHandler(
  { server },
  { request, state, logger }
) {
  logger('info', 'routeCollectionFindCombinedHandler');
  const { params: { id } } = request;
  return collectionFindInState({ id }, state) || {
    httpRequest: {
      method: 'GET',
      url: otherServerEntryUrl({ id }, server),
      onSuccess: { eventName: 'route-collectionFindCombinedResponse', server, id },
      onError: { eventName: 'route-collectionFindCombinedResponse', server, id },
    },
  };
}

function collectionFindInState({ id }, state) {
  const entry = collectionModel.find(
    { id },
    R.propOr([], 'collection', state)
  );
  if (!R.isNil(entry)) {
    const data = {
      link: `/collection/${id}`,
      entry,
    };
    return {
      httpResponse: { data },
    };
  }
  return null;
}

function routeCollectionCombinedResponseHandler(
  { httpStatus, httpData, server, id },
  { logger }
) {
  logger('info', 'routeCollectionCombinedResponseHandler');
  const data = (200 === httpStatus
                ? updateOtherServerLink({ server }, httpData)
                : { link: `/collection/combined/${id}` });
  return {
    httpResponse: { status: httpStatus, data },
  };
}

function routeCollectionUpdateHandler(_event_, { request, state, logger }) {
  logger('info', 'routeCollectionUpdateHandler');
  const { params: { id } } = request;
  return collectionUpdateInState({ id, updateData: request.body }, state) || {
    httpResponse: {
      status: 404,
      data: { link: `/collection/${id}` },
    },
  };
}

function routeCollectionUpdateCombinedHandler(
  { server },
  { request, state, logger }
) {
  logger('info', 'routeCollectionUpdateCombinedHandler');
  const { params: { id } } = request;
  return collectionUpdateInState({ id, updateData: request.body }, state) || {
    httpRequest: {
      method: 'PUT',
      url: otherServerEntryUrl({ id }, server),
      data: request.body,
      onSuccess: { eventName: 'route-collectionUpdateCombinedResponse', server, id },
      onError: { eventName: 'route-collectionUpdateCombinedResponse', server, id },
    },
  };
}

function collectionUpdateInState({ id, updateData }, state) {
  let entry = collectionModel.find(
    { id },
    R.propOr([], 'collection', state)
  );
  if (R.isNil(entry)) {
    return null;
  }

  entry = entryModel.update({ data: updateData }, entry);
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

function routeCollectionRemoveHandler(_event_, { request, state, logger }) {
  logger('info', 'routeCollectionRemoveHandler');
  const { params: { id } } = request;
  return collectionRemoveInState({ id }, state);
}

function routeCollectionRemoveCombinedHandler({ server }, { request, logger }) {
  logger('info', 'routeCollectionRemoveCombinedHandler');
  const { params: { id } } = request;
  return {
    httpRequest: {
      method: 'DELETE',
      url: `http://localhost:${server === 'server1' ? 3051 : 3050}/collection/${id}`,
      onSuccess: { eventName: 'route-collectionRemoveCombinedResponse', server, id },
      onError: { eventName: 'route-collectionRemoveCombinedResponse', server, id },
    },
  };
}

function routeCollectionRemoveCombinedResponseHandler(
  { id },
  { state, logger }
) {
  logger('info', 'routeCollectionRemoveCombinedResponseHandler');
  return collectionRemoveInState({ id }, state);
}

function collectionRemoveInState({ id }, state) {
  return {
    httpResponse: { status: 204, data: 'done' },
    state: R.over(
      R.lensProp('collection'),
      (collection) => collectionModel.remove({ id }, collection),
      state
    ),
  };
}

function otherServerUrl(server) {
  return `http://localhost:${server === 'server1' ? 3051 : 3050}`;
}

function otherServerCollectionUrl(server) {
  return `${otherServerUrl(server)}/collection`;
}

function otherServerEntryUrl({ id }, server) {
  return `${otherServerCollectionUrl(server)}/${id}`;
}

function updateOtherServerLink({ server }, data) {
  return R.over(
    R.lensProp('link'),
    (link) => `${otherServerUrl(server)}${link}`,
    data
  );
}
