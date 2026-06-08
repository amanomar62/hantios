Add-Type -AssemblyName System.Drawing

$dashboardPath = "C:\Users\kapiir\.gemini\antigravity\brain\fe57fc37-d8cd-43f0-8164-32ccc65c6677\somali_hantios_dashboard_1780763410036.png"
$logoPath = "c:\Users\kapiir\Desktop\hantios\client\public\logo.png"
$outputPath = "c:\Users\kapiir\Desktop\hantios\client\public\generated-dashboard.png"

Write-Host "Loading dashboard from: $dashboardPath"
$dbImage = [System.Drawing.Image]::FromFile($dashboardPath)

Write-Host "Loading logo from: $logoPath"
$logoImage = [System.Drawing.Image]::FromFile($logoPath)

# Calculate target logo height keeping aspect ratio (target width = 105px)
$targetWidth = 105
$aspectRatio = $logoImage.Height / $logoImage.Width
$targetHeight = [int]($targetWidth * $aspectRatio)

Write-Host "Target logo size: $targetWidth x $targetHeight"

# Create a clean bitmap and graphics context
$bmp = New-Object System.Drawing.Bitmap($dbImage.Width, $dbImage.Height)
$g = [System.Drawing.Graphics]::FromImage($bmp)

# Draw dashboard image
$g.DrawImage($dbImage, 0, 0, $dbImage.Width, $dbImage.Height)

# Paste logo transparently inside the sidebar dotted placeholder box
# Sidebar starts around x=52. The placeholder box is centered in it.
$logoX = 66
$logoY = 115
$g.DrawImage($logoImage, $logoX, $logoY, $targetWidth, $targetHeight)
Write-Host "Drew logo transparently at ($logoX, $logoY)"

# Clean the AI text hallucination "Kiu designed for..." inside the welcome card
# Welcome card background is white (#FFFFFF)
$cardBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
# Cover old text (x=216, y=185, width=320, height=22)
$g.FillRectangle($cardBrush, 216, 185, 320, 22)

# Draw new clean text: "Built for Somali property owners"
$font = New-Object System.Drawing.Font("Segoe UI", 10, [System.Drawing.FontStyle]::Regular)
$textBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 100, 116, 139)) # Slate 500 (#64748B)
$g.DrawString("Built for Somali property owners", $font, $textBrush, 216, 185)
Write-Host "Corrected subtitle text"

# Dispose drawing resources
$g.Dispose()
$cardBrush.Dispose()
$textBrush.Dispose()
$font.Dispose()

# Save output
$bmp.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)

# Free image files
$dbImage.Dispose()
$logoImage.Dispose()
$bmp.Dispose()

Write-Host "Successfully completed native image overlay!"
