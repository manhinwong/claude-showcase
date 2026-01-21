import { NextRequest, NextResponse } from 'next/server';
import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';

interface SubmittedBuild {
  id: string;
  projectName: string;
  builderName: string;
  school: string;
  githubUrl?: string;
  websiteUrl?: string;
  artifactUrl?: string;
  videoUrl?: string;
  description: string;
  tags: string[];
  submittedAt: string;
  featured: boolean;
}

interface BuildsData {
  builds: SubmittedBuild[];
}

// GET: Retrieve all builds from builds.json
export async function GET() {
  try {
    const buildsPath = join(process.cwd(), 'data', 'builds.json');
    const fileContent = await readFile(buildsPath, 'utf-8');
    const buildsData: BuildsData = JSON.parse(fileContent);
    return NextResponse.json(buildsData.builds);
  } catch (error) {
    console.error('Error fetching builds:', error);
    return NextResponse.json({ error: 'Failed to fetch builds' }, { status: 500 });
  }
}

// POST: Save new submission to builds.json
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.projectName || !body.builderName || !body.school || !body.description || !body.tags) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Ensure at least one project link is provided
    if (!body.githubUrl && !body.websiteUrl && !body.artifactUrl) {
      return NextResponse.json({ error: 'At least one project link required (GitHub, Website, or Artifact)' }, { status: 400 });
    }

    // Validate tags array
    if (!Array.isArray(body.tags) || body.tags.length === 0) {
      return NextResponse.json({ error: 'At least one tag is required' }, { status: 400 });
    }

    // Read current builds.json file
    const buildsPath = join(process.cwd(), 'data', 'builds.json');
    const fileContent = await readFile(buildsPath, 'utf-8');
    const buildsData: BuildsData = JSON.parse(fileContent);

    // Generate next ID (pad to 3 digits)
    const maxId = buildsData.builds.length > 0
      ? Math.max(...buildsData.builds.map(b => parseInt(b.id, 10)))
      : 0;
    const newId = String(maxId + 1).padStart(3, '0');

    // Create build object with only provided fields
    const newBuild: SubmittedBuild = {
      id: newId,
      projectName: body.projectName,
      builderName: body.builderName,
      school: body.school,
      description: body.description,
      tags: body.tags,
      submittedAt: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
      featured: false,
    };

    // Add optional fields only if they exist
    if (body.githubUrl) {
      newBuild.githubUrl = body.githubUrl;
    }
    if (body.websiteUrl) {
      newBuild.websiteUrl = body.websiteUrl;
    }
    if (body.artifactUrl) {
      newBuild.artifactUrl = body.artifactUrl;
    }
    if (body.videoUrl) {
      newBuild.videoUrl = body.videoUrl;
    }

    // Add new build to array
    buildsData.builds.push(newBuild);

    // Write updated builds.json
    await writeFile(buildsPath, JSON.stringify(buildsData, null, 2));

    return NextResponse.json({ success: true, id: newId }, { status: 201 });
  } catch (error) {
    console.error('Submission error:', error);
    return NextResponse.json({ error: 'Submission failed' }, { status: 500 });
  }
}
