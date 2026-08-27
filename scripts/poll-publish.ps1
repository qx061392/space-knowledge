param(
    [string]$AppId,
    [string]$AppSecret
)

$auditIdFile = "$PSScriptRoot\.audit-id"
if (Test-Path $auditIdFile) {
    $auditId = Get-Content $auditIdFile -Encoding utf8
} else {
    Write-Host "   [SKIP] No audit ID found, nothing to poll"
    exit 0
}

$maxRetries = 72  # 72 * 10min = 12 hours max
$retryCount = 0

while ($retryCount -lt $maxRetries) {
    $retryCount++
    
    # Get access_token
    $tokenUrl = "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=$AppId&secret=$AppSecret"
    $tokenResp = Invoke-RestMethod -Uri $tokenUrl -Method Get
    $accessToken = $tokenResp.access_token
    
    if (-not $accessToken) {
        Write-Host "   Token refresh failed, retry in 10 min..."
        Start-Sleep -Seconds 600
        continue
    }
    
    # Check review status
    $statusUrl = "https://api.weixin.qq.com/wxa/get_auditstatus?access_token=$accessToken"
    $body = @{ auditid = $auditId } | ConvertTo-Json
    $resp = Invoke-RestMethod -Uri $statusUrl -Method Post -Body $body -ContentType "application/json"
    
    $status = $resp.auditstatus
    Write-Host "   [$retryCount/$maxRetries] Status: $status - $(Get-Date -Format 'HH:mm:ss')"
    
    switch ($status) {
        0 {  # Approved
            Write-Host "   [OK] Review approved! Publishing..."
            $releaseUrl = "https://api.weixin.qq.com/wxa/release?access_token=$accessToken"
            $releaseResp = Invoke-RestMethod -Uri $releaseUrl -Method Post -Body "{}" -ContentType "application/json"
            if ($releaseResp.errcode -eq 0) {
                Write-Host "   [OK] Published successfully!"
            } else {
                Write-Host "   [FAILED] Publish: $($releaseResp.errcode) $($releaseResp.errmsg)"
            }
            Remove-Item $auditIdFile -Force
            exit 0
        }
        1 {  # Rejected
            Write-Host "   [FAILED] Review rejected: $($resp.reason)"
            Remove-Item $auditIdFile -Force
            exit 1
        }
        2 {  # Under review
            Write-Host "   Still under review, waiting 10 min..."
        }
        default {
            Write-Host "   Unknown status: $status"
        }
    }
    
    Start-Sleep -Seconds 600  # 10 minutes
}

Write-Host "   [TIMEOUT] Review still pending after 12 hours"
exit 1
