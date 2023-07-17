function skillsMember() {
    var member = {
        name: 'John Doe',
        age: 30,
        address: '123 Main St'
    };

    var skills = {
        languages: ['JavaScript', 'Python', 'Java'],
        isProgrammer: true
    };

    // Merge the objects
    var memberSkills = Object.assign(member, skills);

    // Print the result
    console.log(memberSkills);
}