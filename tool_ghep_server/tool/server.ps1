Add-Type -AssemblyName System.Windows.Forms
$OpenFileDialog = New-Object System.Windows.Forms.OpenFileDialog

$OpenFileDialog.Title = "Config file"
$OpenFileDialog.filter = "Config file (config.json)| config.json"
$OpenFileDialog.filename = "config.json"
$config = ""
while (!$config.Length) {
    $res = [System.Windows.Forms.MessageBox]::Show("Chon file config tai thu muc network (bat dau bang \\ hoac R:\)","",4)
    if($res -eq 7)
    {
        return
    }
    $OpenFileDialog.ShowDialog() | Out-Null
    $tmpname = $OpenFileDialog.filename    
    if($tmpname.StartsWith("\\") -or $tmpname.StartsWith("R:\")){
        $config = $tmpname
    }
}
$dir = Split-Path -Path $config -Parent
$requestcapture = "$dir\requestcapture.json"
if(!(Test-Path $requestcapture)){
    [System.Windows.Forms.MessageBox]::Show("ko tim thay file requestcapture.json","")
    return
}

# $res = [System.Windows.Forms.MessageBox]::Show("Capture?","",4)
# $capture = $res -eq 6
$capture = $false
$res = [System.Windows.Forms.MessageBox]::Show("Convert to Equirectangular?","",4)
$equirect = $res -eq 6
$res = [System.Windows.Forms.MessageBox]::Show("Photoshop?","",4)
$pts = $res -eq 6
$res = [System.Windows.Forms.MessageBox]::Show("Convert to RAcube?","",4)
$racube = $res -eq 6
# $res = [System.Windows.Forms.MessageBox]::Show("Shutdown when finish?","",4)
# $shutdown = $res -eq 6
$shutdown = $false



.\tool\node.exe .\tool\server.js -dir $dir -photoshop $pts -capture $capture -equirect $equirect -racube $racube -shutdown $shutdown
