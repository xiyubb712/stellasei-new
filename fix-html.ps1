$file = 'D:\stellasei-new\js\apps\chat.js'
$content = Get-Content $file -Raw -Encoding UTF8

# 在聊天背景描述后面添加恢复默认按钮
$pattern = "(使用默认星空背景'</div>)"
$replacement = "使用默认星空背景'</div>`n                `${session?.background ? ``<button class=`"reset-bg-btn`" onclick=`"event.stopPropagation(); ChatApp.resetChatBackground()`">恢复默认</button>`` : ''}"
$content = $content -replace $pattern, $replacement

Set-Content $file -Value $content -NoNewline -Encoding UTF8
Write-Host "HTML button added!"
