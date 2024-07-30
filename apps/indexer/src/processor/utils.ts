export const extractUnknownFields = (section, method) => {
  if (section === 'dex' && method === 'Swap') {
    return ['trader', 'trading_path', 'supply_Asset_amount', 'target_Asset_amount', 'to'];
  }

  if (section === 'dex' && method === 'AddLiquidity') {
    return ['who', 'asset_id_0', 'reserve_0_increment', 'asset_id_1', 'reserve_1_increment', 'share_increment', 'to'];
  }

  if (section === 'dex' && method === 'RemoveLiquidity') {
    return ['who', 'asset_id_0', 'reserve_0_decrement', 'asset_id_1', 'reserve_1_decrement', 'share_decrement', 'to'];
  }

  return [];
};

export const extraArgsFromEvent = (event, api): { [key: string]: any } => {
  const { method, section, meta, data } = event;
  const args = {};

  if (data) {
    const extractedFields = extractUnknownFields(section, method);
    const fields = meta?.fields || [];
    const fieldsHuman = extractedFields?.length > 0 ? extractedFields : meta?.fields?.toPrimitive();
    const names = fields.map(({ name }) => api.registry.lookup.sanitizeField(name)[0]).filter((n) => !!n);

    data.forEach((data, index) => {
      const value = data.toPrimitive();
      const name = names[index]
        ? names[index]
        : fieldsHuman[index]?.typeName
          ? fieldsHuman[index]?.typeName
          : fieldsHuman[index];
      args[name] = value;
    });
  }

  return args;
};
