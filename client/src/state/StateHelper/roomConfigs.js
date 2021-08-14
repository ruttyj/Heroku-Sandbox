export default function roomConfigs({get, socket})
{

  const basePath = ['room', 'configs'];
  function getField(fieldKey)
  {
    return get([...basePath, 'fields', 'items', fieldKey], {});
  }

  function updateFieldValue(fieldKey, value)
  {
    socket.emit('change_room_config', {key: fieldKey, value: value});
  }


  function getValue(fieldKey)
  {
    return get(['room', 'configs', 'values', fieldKey]);
  }

  return {
    getField,
    updateFieldValue,
    getValue,
  }
}