import fetch from 'node-fetch';

const testCoursesQuery = async () => {
    try {
        const response = await fetch('http://localhost:4000/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: `
                    query {
                        courses {
                            id
                            title
                            instructor {
                                id
                                username
                            }
                        }
                    }
                `
            })
        });

        const result = await response.json();

        if (result.errors) {
            console.error('❌ GraphQL Errors:', JSON.stringify(result.errors, null, 2));
            process.exit(1);
        }

        console.log('✅ Query successful!');
        console.log(`📊 Found ${result.data.courses.length} courses`);
        console.log('\n📝 Courses:');
        result.data.courses.forEach((course: any, index: number) => {
            console.log(`   ${index + 1}. ${course.title}`);
            console.log(`      Instructor: ${course.instructor?.username || 'NULL'} (${course.instructor?.id || 'NULL'})`);
        });

        const coursesWithNullInstructor = result.data.courses.filter((c: any) => !c.instructor);
        if (coursesWithNullInstructor.length > 0) {
            console.log(`\n⚠️  WARNING: ${coursesWithNullInstructor.length} courses still have null instructors!`);
            process.exit(1);
        }

        console.log('\n🎉 SUCCESS! All courses have valid instructors.');
        process.exit(0);

    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
};

testCoursesQuery();
