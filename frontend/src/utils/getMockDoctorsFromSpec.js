// src/utils/getMockDoctorsFromSpec.js
import yaml from 'js-yaml';

export async function getMockDoctorsFromSpec() {
  try {
    const res = await fetch('/openapi.yaml');
    const yamlText = await res.text();
    const doc = yaml.load(yamlText);

    const doctorSchema =
      doc?.paths?.['/api/doctors']?.get?.responses?.['200']?.content?.['application/json']?.schema;

    // You can map from schema here later if you have examples in OpenAPI
    // For now we return mock data
    return [
      {
        id: '1',
        name: 'Dr. Rajesh Sharma',
        specialization: 'Panchakarma',
        experience: '15 years',
        rating: 4.8,
        reviews: 234,
        mode: ['Online', 'In-person'],
        languages: ['Hindi', 'English'],
        consultationFee: 500,
        availableModes: ['video', 'in_person'],
        nextAvailable: 'Today 2:00 PM'
      },
      {
        id: '2',
        name: 'Dr. Priya Patel',
        specialization: "Women's Health",
        experience: '12 years',
        rating: 4.9,
        reviews: 189,
        mode: ['Online'],
        languages: ['Hindi', 'English', 'Gujarati'],
        consultationFee: 600,
        availableModes: ['video'],
        nextAvailable: 'Tomorrow 10:00 AM'
      },
      {
        id: '3',
        name: 'Dr. Arjun Kumar',
        specialization: 'Skin & Hair Care',
        experience: '10 years',
        rating: 4.7,
        reviews: 156,
        mode: ['Online', 'In-person'],
        languages: ['Hindi', 'English', 'Tamil'],
        consultationFee: 450,
        availableModes: ['video', 'in_person'],
        nextAvailable: 'Today 4:30 PM'
      }
    ];
  } catch (err) {
    console.error('Failed to load OpenAPI spec:', err);
    return [];
  }
}
