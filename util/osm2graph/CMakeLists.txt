cmake_minimum_required (VERSION 3.8)

project(osm2graph)  

add_executable(${PROJECT_NAME}  
    "src/osm2graph.cpp"
)

target_include_directories(${PROJECT_NAME} PRIVATE "${CMAKE_CURRENT_SOURCE_DIR}/include")
target_link_libraries(${PROJECT_NAME} ${CMAKE_CURRENT_SOURCE_DIR}/lib/libzlib.a)

file(COPY ${CMAKE_CURRENT_SOURCE_DIR}/resources DESTINATION "${CMAKE_CURRENT_BINARY_DIR}")

install(TARGETS ${PROJECT_NAME} DESTINATION bin)