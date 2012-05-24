#!/bin/bash
#
# <#> a <http://purl.org/twc/vocab/conversion/ConversionTrigger> ;
#     rdfs:seeAlso <https://github.com/timrdf/csv2rdf4lod-automation/wiki/Conversion-trigger>,
#                  <https://github.com/timrdf/csv2rdf4lod-automation/blob/master/bin/cr-create-convert-sh.sh> .
#
# datasetID versionID (lastModDate):
# nwis-measurements-ri 2011-Mar-20 ()
#--------------------------------------------------------------

CSV2RDF4LOD_HOME=${CSV2RDF4LOD_HOME:?"not set; source csv2rdf4lod/source-me.sh or see https://github.com/timrdf/csv2rdf4lod-automation/wiki/CSV2RDF4LOD-not-set"}

surrogate="http://logd.tw.rpi.edu" # Came from $CSV2RDF4LOD_BASE_URI when cr-create-convert-sh.sh created this script.
sourceID="usgs-gov"
datasetID="nwis-measurements-ri"
datasetVersion="2011-Mar-20"        # NO SPACES; Use curl -I -L http://www.data.gov/download/nwis-measurements-ri/csv | grep Last-Modified: | awk '{printf(%s-%s-%s,,,)}'
versionID="2011-Mar-20"             # renaming datasetVersion (deprecating datasetVersion)
eID="1"                             # enhancement identifier
if [ $# -ge 2 ]; then
   if [ $1 == "-e" ]; then
     eID="$2" 
   fi
fi


# source/US-44-003-result.csv
sourceDir="source"                  # if directly from source, 'source'; if manual manipulations of source were required, 'manual'.
destDir="automatic"                 # always 'automatic'
#--------------------------------------------------------------


#-----------------------------------
datafile="US-44-003-result.csv"
data="$sourceDir/$datafile"
subjectDiscriminator=""             # Additional part of URI for subjects created; must be URI-ready (e.g., no spaces).
commentCharacter=""                 # ONLY one character; complain to http://sourceforge.net/projects/javacsv/ otherwise.
cellDelimiter=","                   # ONLY one character; complain to http://sourceforge.net/projects/javacsv/ otherwise.
header=                             # Line that header is on; only needed if not '1'. '0' means no header.
dataStart=                          # Line that data starts; only needed if not immediately after header.
repeatAboveIfEmptyCol=              # 'Fill in' value from row above for this column.
onlyIfCol=                          # Do not process if value in this column is empty
interpretAsNull=                    # NO SPACES
dataEnd=                            # Line on which data stops; only needed if non-data bottom matter (legends, footnotes, etc).
source $CSV2RDF4LOD_HOME/bin/convert.sh


#-----------------------------------
source $CSV2RDF4LOD_HOME/bin/convert-aggregate.sh
