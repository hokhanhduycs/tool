# documet : https://theiviaxx.github.io/photoshop-docs/Photoshop/index.html
[CmdletBinding()]
param (
    [switch]
    $test,
    [switch]
    $quit,
    [string]
    $action,
    [string]
    $group,
    [string]
    $id,
    [string]
    $cwd,
    [switch]
    $show
)

$ps = New-Object -ComObject Photoshop.Application
if($quit){
        $ps.quit();
        return
}

$ps.Visible = $show;
# $ps.DisplayDialogs = 3;
$inpath = ""
$outpath = ""
if(!$cwd.Length){
        $cwd = Resolve-Path .
}
if($test){
        $inpath = Resolve-Path "test.tif"
        $outpath = "$(Resolve-Path .)\test_out.tif"
}elseif($id.Length){
        $inpath = "$cwd\pano\$id.tif"
        $outpath = "$cwd\pano_out\$id.tif"
}

if($action.Length -and $group.Length -and $inpath.Length -and $outpath.Length){
        Write-Host "Photoshop open $inpath"
        $doc = $ps.Open($inpath)
        $ps.DoAction($action,$group)
        $options = New-Object -ComObject Photoshop.TiffSaveOptions
        $doc.SaveAs($outpath,$options,$true,2)
        Write-Host "Photoshop save $outpath"
        $doc.Close(2)
}

# 'TN_360_b_bambu','TN_v13_duyen'