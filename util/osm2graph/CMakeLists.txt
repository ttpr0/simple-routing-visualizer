# CMakeList.txt: CMake-Projekt für "osm2graph". Schließen Sie die Quelle ein, und definieren Sie
# projektspezifische Logik hier.
#
cmake_minimum_required (VERSION 3.8)

add_executable (osm2graph  
"osm2graph.cpp")

target_link_libraries(osm2graph lib/zlib)

target_include_directories(osm2graph PUBLIC include)

file(COPY ${CMAKE_CURRENT_SOURCE_DIR}/data/default.pbf DESTINATION ${CMAKE_CURRENT_BINARY_DIR}/data)

# Fügen Sie der ausführbaren Datei dieses Projekts eine Quelle hinzu.
