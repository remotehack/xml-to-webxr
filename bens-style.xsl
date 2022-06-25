<?xml version="1.0"?>
<xsl:stylesheet version="1.0" xmlns:itunes="itunes" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

  <xsl:output method="html"/>
  <!-- HTML has to be output within a template. Here isn't the global document space -->
  
  <xsl:template match="/">
    <html>
        <head>
            <title>🧙‍♀️</title>
        </head>
        <body>
            <div id="output"></div>

            <div id="content">
                <xsl:apply-templates select="*"/>
            </div>
            
            <script src="live-reload.js"></script>
            <script type="module" src="embedded.js"></script>

        </body>
    </html>
  </xsl:template>

  <xsl:template match="item">
    <section class="item">
        <h2><xsl:value-of select="title"/></h2>
        
        <p><xsl:value-of select="description"/></p>
        <!-- special caps for BEN. There's a different syntax to inject values into attributes -->
        <A HREF="{enclosure/@url}">link (<span><xsl:value-of select="//*[name()='itunes:duration']"/></span>)</A>
        
        <hr />
    </section>
  </xsl:template>

</xsl:stylesheet>
