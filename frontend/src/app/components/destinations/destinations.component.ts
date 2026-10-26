import { Component, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { ApiService } from '../../services/api.service'

@Component({
  selector: 'app-destinations',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-header">
      <h1>Destinations</h1>
      <p class="subtitle">SSH machines to send backups to</p>
    </div>

    <div class="card" style="margin-bottom: 2rem">
      <h3 style="margin-bottom: 1rem">Add SSH destination</h3>
      <div class="form-grid">
        <div class="form-group">
          <label>Name</label>
          <input [(ngModel)]="form.name" placeholder="e.g. prod-server" />
        </div>
        <div class="form-group">
          <label>Host</label>
          <input [(ngModel)]="form.host" placeholder="192.168.1.10" />
        </div>
        <div class="form-group">
          <label>SSH Port</label>
          <input [(ngModel)]="form.port" type="number" placeholder="22" />
        </div>
        <div class="form-group">
          <label>Username</label>
          <input [(ngModel)]="form.username" placeholder="ubuntu" />
        </div>
        <div class="form-group" style="grid-column: span 2">
          <label>Private key path</label>
          <input [(ngModel)]="form.key_path" placeholder="/app/keys/id_rsa" />
        </div>
        <div class="form-group" style="grid-column: span 2">
          <label>Remote folder</label>
          <input [(ngModel)]="form.remote_path" placeholder="/tmp/safebase-backups" />
        </div>
      </div>
      <button class="btn-primary" (click)="add()">Save</button>
      <p *ngIf="msg" style="margin-top: 0.5rem; color: #2D7A2D">{{ msg }}</p>
    </div>

    <table *ngIf="destinations.length > 0">
      <thead>
        <tr>
          <th>Name</th>
          <th>Host</th>
          <th>Port</th>
          <th>Username</th>
          <th>Remote folder</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let d of destinations">
          <td><strong>{{ d.name }}</strong></td>
          <td>{{ d.host }}</td>
          <td>{{ d.port }}</td>
          <td>{{ d.username }}</td>
          <td><code>{{ d.remote_path }}</code></td>
          <td>
            <div class="actions">
              <button class="btn-danger" (click)="delete(d.id)">Delete</button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <p *ngIf="destinations.length === 0" style="color: #888">
      No destinations registered. Backups will be stored locally by default.
    </p>
  `
})
export class DestinationsComponent implements OnInit {
  destinations: any[] = []
  msg = ''
  form = { name: '', host: '', port: 22, username: '', key_path: '', remote_path: '/tmp/safebase-backups' }

  constructor(private api: ApiService) {}

  ngOnInit() { this.load() }

  load() {
    this.api.getDestinations().subscribe(d => this.destinations = d)
  }

  add() {
    this.api.addDestination({ ...this.form, type: 'ssh' }).subscribe(() => {
      this.msg = 'Destination added'
      this.form = { name: '', host: '', port: 22, username: '', key_path: '', remote_path: '/tmp/safebase-backups' }
      this.load()
      setTimeout(() => this.msg = '', 3000)
    })
  }

  delete(id: number) {
    this.api.deleteDestination(id).subscribe(() => this.load())
  }
}
