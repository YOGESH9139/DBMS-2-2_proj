// Table configurations - one object per entity
const TABLES={
  departments:{
    id:'departments',api:'/departments',pk:['department_id'],label:'Department',
    cols:[{key:'department_id',label:'ID'},{key:'department_name',label:'Name'}],
    fields:[{key:'department_name',label:'Department Name'}],
    add:d=>api('/departments','POST',d),upd:(pk,d)=>api('/departments/'+pk[0],'PUT',d),del:pk=>api('/departments/'+pk[0],'DELETE'),
  },
  students:{
    id:'students',api:'/students',pk:['student_id'],label:'Student',nameLink:true,
    cols:[{key:'student_id',label:'ID'},{key:'student_name',label:'Name',link:'student-profile.html?id='},{key:'email',label:'Email'},{key:'phone',label:'Phone'},{key:'address',label:'Address'},{key:'department_name',label:'Dept'}],
    fields:[
      {key:'student_name',label:'Name'},{key:'email',label:'Email',type:'email'},{key:'phone',label:'Phone'},{key:'address',label:'Address'},
      {key:'department_id',label:'Department',type:'select',cache:'departments',vk:'department_id',lk:'department_name'},
    ],
    add:d=>api('/students','POST',d),upd:(pk,d)=>api('/students/'+pk[0],'PUT',d),del:pk=>api('/students/'+pk[0],'DELETE'),
  },
  courses:{
    id:'courses',api:'/courses',pk:['course_id'],label:'Course',
    cols:[{key:'course_id',label:'ID'},{key:'course_name',label:'Name'},{key:'credits',label:'Credits'},{key:'department_name',label:'Dept'}],
    fields:[
      {key:'course_name',label:'Course Name'},{key:'credits',label:'Credits',type:'number'},
      {key:'department_id',label:'Department',type:'select',cache:'departments',vk:'department_id',lk:'department_name'},
    ],
    add:d=>api('/courses','POST',d),upd:(pk,d)=>api('/courses/'+pk[0],'PUT',d),del:pk=>api('/courses/'+pk[0],'DELETE'),
  },
  faculty:{
    id:'faculty',api:'/faculty',pk:['faculty_id'],label:'Faculty',
    cols:[{key:'faculty_id',label:'ID'},{key:'faculty_name',label:'Name',link:'faculty-profile.html?id='},{key:'email',label:'Email'},{key:'department_name',label:'Dept'}],
    fields:[
      {key:'faculty_name',label:'Faculty Name'},{key:'email',label:'Email',type:'email'},
      {key:'department_id',label:'Department',type:'select',cache:'departments',vk:'department_id',lk:'department_name'},
    ],
    add:d=>api('/faculty','POST',d),upd:(pk,d)=>api('/faculty/'+pk[0],'PUT',d),del:pk=>api('/faculty/'+pk[0],'DELETE'),
  },
  enrollments:{
    id:'enrollments',api:'/enrollments',pk:['student_id','course_id'],label:'Enrollment',
    cols:[{key:'student_id',label:'Stud ID'},{key:'student_name',label:'Student'},{key:'course_id',label:'Course ID'},{key:'course_name',label:'Course'},{key:'semester',label:'Semester'}],
    fields:[
      {key:'student_id',label:'Student',type:'select',cache:'students',vk:'student_id',lk:'student_name'},
      {key:'course_id',label:'Course',type:'select',cache:'courses',vk:'course_id',lk:'course_name'},
      {key:'semester',label:'Semester'},
    ],
    add:d=>api('/enrollments','POST',d),upd:(pk,d)=>api('/enrollments','PUT',{...d,old_student_id:pk[0],old_course_id:pk[1]}),del:pk=>api('/enrollments','DELETE',{student_id:pk[0],course_id:pk[1]}),
  },
  results:{
    id:'results',api:'/results',pk:['result_id'],label:'Result',
    cols:[{key:'result_id',label:'ID'},{key:'student_name',label:'Student'},{key:'course_name',label:'Course'},{key:'marks',label:'Marks'},{key:'grade',label:'Grade'}],
    fields:[
      {key:'student_id',label:'Student',type:'select',cache:'students',vk:'student_id',lk:'student_name'},
      {key:'course_id',label:'Course',type:'select',cache:'courses',vk:'course_id',lk:'course_name'},
      {key:'marks',label:'Marks',type:'number'},{key:'grade',label:'Grade'},
    ],
    add:d=>api('/results','POST',d),upd:(pk,d)=>api('/results/'+pk[0],'PUT',d),del:pk=>api('/results/'+pk[0],'DELETE'),
  },
  attendance:{
    id:'attendance',api:'/attendance',pk:['attendance_id'],label:'Attendance',
    cols:[{key:'attendance_id',label:'ID'},{key:'student_name',label:'Student'},{key:'course_name',label:'Course'},{key:'attendance_percentage',label:'Attendance %'}],
    fields:[
      {key:'student_id',label:'Student',type:'select',cache:'students',vk:'student_id',lk:'student_name'},
      {key:'course_id',label:'Course',type:'select',cache:'courses',vk:'course_id',lk:'course_name'},
      {key:'attendance_percentage',label:'Attendance %',type:'number'},
    ],
    add:d=>api('/attendance','POST',d),upd:(pk,d)=>api('/attendance/'+pk[0],'PUT',d),del:pk=>api('/attendance/'+pk[0],'DELETE'),
  },
  drivers:{
    id:'drivers',api:'/drivers',pk:['driver_id'],label:'Driver',
    cols:[{key:'driver_id',label:'ID'},{key:'driver_name',label:'Name'},{key:'phone',label:'Phone'}],
    fields:[{key:'driver_name',label:'Driver Name'},{key:'phone',label:'Phone'}],
    add:d=>api('/drivers','POST',d),upd:(pk,d)=>api('/drivers/'+pk[0],'PUT',d),del:pk=>api('/drivers/'+pk[0],'DELETE'),
  },
  routes:{
    id:'routes',api:'/routes',pk:['route_id'],label:'Route',
    cols:[{key:'route_id',label:'ID'},{key:'route_name',label:'Route Name'}],
    fields:[{key:'route_name',label:'Route Name'}],
    add:d=>api('/routes','POST',d),upd:(pk,d)=>api('/routes/'+pk[0],'PUT',d),del:pk=>api('/routes/'+pk[0],'DELETE'),
  },
  'route-stops':{
    id:'route-stops',api:'/route-stops',pk:['stop_id'],label:'Route Stop',
    cols:[{key:'stop_id',label:'ID'},{key:'route_name',label:'Route'},{key:'stop_name',label:'Stop'}],
    fields:[{key:'route_id',label:'Route',type:'select',cache:'routes',vk:'route_id',lk:'route_name'},{key:'stop_name',label:'Stop Name'}],
    add:d=>api('/route-stops','POST',d),upd:(pk,d)=>api('/route-stops/'+pk[0],'PUT',d),del:pk=>api('/route-stops/'+pk[0],'DELETE'),
  },
  buses:{
    id:'buses',api:'/buses',pk:['bus_no'],label:'Bus',
    cols:[{key:'bus_no',label:'Bus No'},{key:'capacity',label:'Capacity'},{key:'route_name',label:'Route'},{key:'driver_name',label:'Driver'}],
    fields:[
      {key:'bus_no',label:'Bus No',type:'number'},{key:'capacity',label:'Capacity',type:'number'},
      {key:'route_id',label:'Route',type:'select',cache:'routes',vk:'route_id',lk:'route_name'},
      {key:'driver_id',label:'Driver',type:'select',cache:'drivers',vk:'driver_id',lk:'driver_name'},
    ],
    add:d=>api('/buses','POST',d),upd:(pk,d)=>api('/buses/'+pk[0],'PUT',d),del:pk=>api('/buses/'+pk[0],'DELETE'),
  },
  transport:{
    id:'transport',api:'/transport',pk:['transport_id'],label:'Transport',
    cols:[{key:'transport_id',label:'ID'},{key:'student_name',label:'Student'},{key:'bus_no',label:'Bus No'}],
    fields:[
      {key:'student_id',label:'Student',type:'select',cache:'students',vk:'student_id',lk:'student_name'},
      {key:'bus_no',label:'Bus',type:'select',cache:'buses',vk:'bus_no',lk:'bus_no'},
    ],
    add:d=>api('/transport','POST',d),upd:(pk,d)=>api('/transport/'+pk[0],'PUT',d),del:pk=>api('/transport/'+pk[0],'DELETE'),
  },
  'course-faculty':{
    id:'course-faculty',api:'/course-faculty',pk:['course_id','faculty_id'],label:'Course-Faculty',
    cols:[{key:'course_name',label:'Course'},{key:'faculty_name',label:'Faculty'}],
    fields:[
      {key:'course_id',label:'Course',type:'select',cache:'courses',vk:'course_id',lk:'course_name'},
      {key:'faculty_id',label:'Faculty',type:'select',cache:'faculty',vk:'faculty_id',lk:'faculty_name'},
    ],
    add:d=>api('/course-faculty','POST',d),upd:null,del:pk=>api('/course-faculty','DELETE',{course_id:pk[0],faculty_id:pk[1]}),
  },
};
