export function shouldHideWindowOnClose(isQuitting, hasTray = true) {
  return !isQuitting && hasTray
}

export function createTrayMenuTemplate({
  locale = 'en',
  showWindow,
  hideWindow,
  openExtensions,
  quit,
}) {
  const isChinese = locale.toLowerCase().startsWith('zh')

  return [
    {
      label: isChinese ? '打开 DeepSeek Harness Desktop' : 'Open DeepSeek Harness Desktop',
      click: showWindow,
    },
    {
      label: isChinese ? '隐藏窗口' : 'Hide Window',
      click: hideWindow,
    },
    {
      label: isChinese ? '扩展与教程' : 'Extensions & Tutorials',
      click: openExtensions,
    },
    { type: 'separator' },
    {
      label: isChinese ? '退出' : 'Quit',
      click: quit,
    },
  ]
}
