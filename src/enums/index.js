export const timeMap = {
  am: [
    {
      label: "1号",
      value: "10:00"
    },
    {
      label: "2号",
      value: "10:30"
    },
    {
      label: "3号",
      value: "11:00"
    },
    {
      label: "4号",
      value: "11:30"
    },
    {
      label: "5号",
      value: "12:00"
    }
  ],
  pm: [
    {
      label: "6号",
      value: "13:00"
    },
    {
      label: "7号",
      value: "13:30"
    },
    {
      label: "8号",
      value: "14:00"
    },
    {
      label: "9号",
      value: "14:30"
    },
    {
      label: "10号",
      value: "15:00"
    },
    {
      label: "11号",
      value: "15:30"
    },
    {
      label: "12号",
      value: "16:00"
    },
    {
      label: "13号",
      value: "16:30"
    },
    {
      label: "14号",
      value: "17:00"
    },
    {
      label: "15号",
      value: "17:30"
    },
    {
      label: "16号",
      value: "18:00"
    },
    {
      label: "17号",
      value: "18:30"
    },
    {
      label: "18号",
      value: "19:00"
    },
    {
      label: "19号",
      value: "19:30"
    },
    {
      label: "20号",
      value: "20:00"
    }
  ]
};

timeMap.am = timeMap.am.map(v => v.value + '     ' + v.label);
timeMap.pm = timeMap.pm.map(v => v.value + '     ' + v.label);