<?xml version="1.0"?>
<xsl:stylesheet version="1.0" xmlns:itunes="itunes" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

  <xsl:output method="html"/>
  <!-- HTML has to be output within a template. Here isn't the global document space -->
  
  <xsl:template match="/">
    <html>
        <head>
            <title>🧙‍♀️</title>
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <script async="async" src="https://unpkg.com/es-module-shims@1.3.6/dist/es-module-shims.js"></script>

            <script type="importmap">
            {
                "imports": {
                "three": "https://unpkg.com/three@0.141.0/build/three.module.js"
                }
            }
            </script>
            
            <style>
            html, body { width: 100vw; min-height: 100vh; margin: 0 auto;}
            html { font-size: 20px; font-family: sans-serif;overflow-x: hidden;} 
            .item {
              border-bottom: 1px solid red;
              margin: 2rem auto; 
              max-width: 80vw;
            }
            .label { background-color: rgba(0,0,0,.8); padding: .5em; color: #fff; border-radius: 1em;}
            </style>
        </head>
        <body>
            <div id="output"></div>

            <div id="content">
                <xsl:apply-templates select="*"/>
            </div>
            
            
            <!-- <script src="live-reload.js"></script> -->
            <script type="module" src="embedded.js"></script>

        </body>
    </html>
  </xsl:template>

  <xsl:template match="item">
    <section class="item">
        <h2><xsl:value-of select="title"/></h2>
        <p><xsl:value-of select="description"/></p>
        <xsl:element name="a">
          <xsl:attribute name="href"><xsl:value-of select="enclosure/@url"/></xsl:attribute>
          <xsl:value-of select="//*[name()='enclosure']/@url"/> (<span><xsl:value-of select="//*[name()='itunes:duration']"/></span>)
        </xsl:element>
    </section>
  </xsl:template>
</xsl:stylesheet>
