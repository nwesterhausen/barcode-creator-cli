# barcode-creator-cli

Create 2D Barcodes with CLI

Grab the release from the releases page and extract.

```
PS C:\Users\nwesterhausen> .\barcode-creator.exe -h
Use like this:
C:\Users\nwesterhausen\barcode-creator.exe [-f FORMAT -o OUTPUT] barcodetext

Options:
  -f, --format=       Specify a barcode format.
                        [Default: CODE128]

  -h, --help          Show this help message and quit.

  -o, --outputfile=   Specify an output file. QRCODE requires .png!
                        [Default: ./barcode.png]

  -t, --text=         Specify what text is at the bottom of the barcode.
                      Only valid for 1D barcodes.
                        [Default: text is the same as the barcode]

  -s, --fontSize=,    Specify the fontSize for the text under the barcode.
    --size=           Only valid for 1D barcodes.

  -T, --notext        Do not display anything at the bottom of the barcode.
                      Only valid for 1D barcodes.

  -x, --barwidth=     Specify width of the barcode bars (in pixels)
                      Only valid for 1D barcodes.
                        [Default value: 2]

  -y, --barheight=    Specify height of the barcode bars (in pixels)
                      Only valid for 1D barcodes.
                        [Default value: 100]

  EXAMPLES:
  To create a barcode without text at the bottom:
    barcode-creator --text='' 11235

  To create a barcode with different text than content:
    barcode-creator --text='Continue' "cont"

  To create a QRCode for a give URL:
    barcode-creator -f QRCODE 'https://google.com'

Format Options:
  - CODE128
  - CODE128A
  - CODE128B
  - CODE128C
  - UPC
  - EAN13
  - EAN8
  - EAN5
  - EAN2
  - CODE39
  - ITF14
  - MSI
  - MSI10
  - MSI11
  - MSI1010
  - MSI1110
  - pharmacode
  - codabar
  - QRCODE

Output Options:
  - png
  - svg
```
