param(
    [string]$AppId,
    [string]$AppSecret
)

# Get access_token
$tokenUrl = "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=$AppId&secret=$AppSecret"
$tokenResp = Invoke-RestMethod -Uri $tokenUrl -Method Get
$accessToken = $tokenResp.access_token

if (-not $accessToken) {
    Write-Host "[FAILED] Cannot get access_token: $($tokenResp.errmsg)"
    exit 1
}
Write-Host "   [OK] Got access_token"

# Get latest template list (optional - use default)
# Submit for review
$submitUrl = "https://api.weixin.qq.com/wxa/submit_audit?access_token=$accessToken"
$body = @{
    item_list = @(@{
        address = "index"
        tag = "space_knowledge"
    })
} | ConvertTo-Json -Depth 3

try {
    $resp = Invoke-RestMethod -Uri $submitUrl -Method Post -Body $body -ContentType "application/json"
    if ($resp.errcode -eq 0) {
        $auditId = $resp.auditid
        Write-Host "   [OK] Review submitted (auditId: $auditId)"
        # Save auditId for polling
        $auditId | Out-File -FilePath "$PSScriptRoot\.audit-id" -Encoding utf8
    } else {
        Write-Host "   [FAILED] $($resp.errcode): $($resp.errmsg)"
        exit 1
    }
} catch {
    Write-Host "   [FAILED] $($_.Exception.Message)"
    exit 1
}
